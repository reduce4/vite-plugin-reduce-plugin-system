export default function reducePluginSystem() {
    return {
        name: 'reducePluginSystem',
        transform(code, id) {
            if (/dsl\.js/.test(id)) {
                const serviceComponent = JSON.parse(code.replace(/export[\s]+default[\s]*/g, ''));
                let data = JSON.stringify(serviceComponent.api.data);
                const headers = JSON.stringify({
                    ...serviceComponent.api.headers,
                    'Content-Type': "application/json"
                })
                return `
                    import React,{useState, useEffect} from 'react';
                    import {message} from 'antd'
                    export default function({children}){
                    
                       const [value, onChange] = useState({'@reduce/chatgpt@0.0.0':null});
                       
                       useEffect(() => {
                            if(value['@reduce/chatgpt0.0.0'] == null){
                                return;                                
                            }
                            const fdata = async () => {
                                try{
                                    const res = await fetch('${serviceComponent.api.url}', {
                                        method: '${serviceComponent.api.method}',
                                        headers: ${headers},
                                        body: '${data}'
                                    });
                                    const d = (await res.json())
                                    onChange({...value, '@reduce/chatgpt@0.0.0': d})
                                }catch(e){
                                    message.error(e.message);
                                }
                            }
                            fdata();
                       },[value['@reduce/chatgpt0.0.0']]);
                       return React.createElement(children.type, {...children.props, value, onChange});
                    }
                `;

            }
            return code;
        }
    }
}