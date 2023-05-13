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
function generateHooks(hooksDslObject) {
    const keys = Object.keys(hooksDslObject);
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
export default function reducePluginSystem() {
    return {
        name: 'reducePluginSystem',
        transform(code, id) {
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
    }
}