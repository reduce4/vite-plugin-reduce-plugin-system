import md5 from 'md5'
const calHookName = (processId, hookName) => {
    if (hookName == null) {
        return;
    }
    return 'r' + md5(processId) + hookName;
}
function firstLetterUpperCase(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}
function generateUseStates(hooksDslObject) {
    const keys = Object.keys(hooksDslObject);
    return `
        ${keys.reduce((v, t, i) => {
        return v + `
            const [${t},set${firstLetterUpperCase(t)}] = useState(${hooksDslObject[t].inputInitValue});
            ${hooksDslObject[t].output == null ? "" :
                `const [${hooksDslObject[t].output},set${firstLetterUpperCase(hooksDslObject[t].output)}] = useState(${hooksDslObject[t].outputInitValue});`
            }
        `;
    }, '')}
    `;
}

/**
 * @generaterules stateName : r+md5(processId)+stateName
 */
function generateProcessUseStates(set) {
    var states = [];
    for (var processNode of set) {
        const { id, data: { plugin: { dsl: { hooks } } } } = processNode;
        for (var hookItemKey in hooks) {
            const hookItem = hooks[hookItemKey];
            const hookInputName = hookItem.input;
            const hookInputInitValue = hookItem.inputInitValue;
            const hookOutputName = hookItem.output;
            const hookOutputInitValue = hookItem.outputInitValue;
            const calHookInputName = calHookName(id, hookInputName)
            const calHookOutputName = calHookName(id, hookOutputName)
            if (calHookInputName) {
                states.push(`const [${calHookInputName}, set${firstLetterUpperCase(calHookInputName)}] = useState(${hookInputInitValue});`);
            }
            if (calHookOutputName) {
                states.push(`const [${calHookOutputName}, set${firstLetterUpperCase(calHookOutputName)}] = useState(${hookOutputInitValue});`);
            }
        }
    }
    return states.join("\n");
}
function generateProcessProp(set) {
    const processProp = [];
    for (var processItem of set) {
        processProp.push(`
            "${processItem.id}":{
                "in_org_id":"${processItem.data.plugin.in_org_id}",
                "hooks":${generateHooks(processItem.data.plugin.dsl.hooks, calHookName, [processItem.id])},
                "config":${JSON.stringify(processItem.data.plugin.dsl.config ?? {})}
            }
        `);
    }
    return processProp;
}
function generateProcessProps(set) {
    return `
        ...{
            ${generateProcessProp(set).join(",")}
        }
    `;
}
function generateHooks(hooksDslObject, hookValueVariableMappingRuleFunction, params) {
    const keys = Object.keys(hooksDslObject);
    if (typeof hookValueVariableMappingRuleFunction == "function") {
        const id = params[0];
        return `
        {
            ${keys.reduce((v, t, i) => {
            v.push(`${t}:${hookValueVariableMappingRuleFunction(id, t)}`);
            v.push(`set${firstLetterUpperCase(t)}:set${firstLetterUpperCase(hookValueVariableMappingRuleFunction(id, t))}`);
            if (hooksDslObject[t].output != null) {
                v.push(`${hooksDslObject[t].output}:${hookValueVariableMappingRuleFunction(id, hooksDslObject[t].output)}`);
                v.push(`set${firstLetterUpperCase(hooksDslObject[t].output)}:set${firstLetterUpperCase(hookValueVariableMappingRuleFunction(id, hooksDslObject[t].output))}`);
            }
            return v;
        }, []).join(",")
            }
        }
    `;
    }
    return `
        {
            ${keys.reduce((v, t, i) => {
        v.push(`${t}:${t}`);
        v.push(`set${firstLetterUpperCase(t)}:set${firstLetterUpperCase(t)}`);
        if (hooksDslObject[t].output != null) {
            v.push(`${hooksDslObject[t].output}:${hooksDslObject[t].output}`);
            v.push(`set${firstLetterUpperCase(hooksDslObject[t].output)}:set${firstLetterUpperCase(hooksDslObject[t].output)}`);
        }
        return v;
    }, []).join(",")
        }
        }
    `;
}
function handleEdge(dsl) {
    const wrappers = [];
    for (var node of dsl) {
        if (node.shape == "edge") {
            const sourceId = node.source.cell;
            const targetId = node.target.cell;
            const source = dsl.find(({ id }) => id == sourceId);
            const target = dsl.find(({ id }) => id == targetId);
            const wrapper = [source, target];
            wrappers.push(wrapper);
        }
    }
    return wrappers;
}

function handlePairs(pairs) {
    const set = [];
    for (var pair of pairs) {
        const pair0 = pair[0];
        const pair1 = pair[1];
        if (!set.find(({ id }) => pair0.id == id)) {
            set.push(pair0);
        }
        if (!set.find(({ id }) => pair1.id == id)) {
            set.push(pair1);
        }
    }
    return set;
}
/**
 * @mode 'development' | 'plugin' | 'base'
 * development: Dsl will generate wrapper code.
 * plugin: As plugin inject to sub micro app.
 * base: As foundation of plugin.
 */
export default function reducePluginSystem({
    mode = 'development'
}) {
    return {
        name: 'reducePluginSystem',
        transform(code, id) {
            if (mode == 'development') {
                if (/dsl\.js/.test(id)) {
                    const dslObject = JSON.parse(code.replace(/export[\s]+default[\s]*/g, '').replace(/\n/g, ' '));
                    return `
                        import React,{useState, useEffect} from 'react';
                        export default function({children}){
                            ${generateUseStates(dslObject.hooks)}
                            return React.createElement(children.type, {...children.props, hooks: ${generateHooks(dslObject.hooks)},config: ${JSON.stringify(dslObject.config)}});
                        }
                    `;
                }
                return code;
            }
            if (mode == 'plugin') {
                if (/dsl\.js/.test(id)) {
                    return `
                        import React from 'react';
                        export default function({children}){
                            return React.createElement(children.type);
                        }
                    `;
                }
            }
            if (mode == 'base') {
                if (/base_dsl\.js/.test(id)) {
                    const dslObject = JSON.parse(code.replace(/export[\s]+default[\s]*/g, '').replace(/\n/g, ' '));
                    const pairProcesses = handleEdge(dslObject);
                    const set = handlePairs(pairProcesses);
                    return `
                        import React,{useState, useEffect} from 'react';
                        export default function({children}){
                            ${generateProcessUseStates(set)}
                            return React.createElement(children.type,
                                {...children.props, ${generateProcessProps(set)}}
                            );
                        }
                    `;
                }
            }
            return code;
        }
    }
}