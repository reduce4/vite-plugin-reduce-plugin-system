export default function reducePluginSystem() {
    return {
        name: 'reducePluginSystem',
        transform(code, id) {
            if (/dsl\.js/.test(id)) {
                const serviceComponent = JSON.parse(code.replace(/export[\s]+default[\s]*/g, ''));
                const data = JSON.stringify(serviceComponent.api.data);
                const headers = JSON.stringify({
                    ...serviceComponent.api.headers,
                    'Content-Type': "application/json"
                })
                return `
                    import React,{useState, useEffect} from 'react';
                    import {message} from 'antd'
                    export default function({children}){
                       const [condition, setCondition] = useState(null);
                       const [value, onChange] = useState(null);
                       
                       useEffect(() => {
                            const fdata = async () => {
                                try{
                                    const res = await fetch('${serviceComponent.api.url}', {
                                        method: '${serviceComponent.api.method}',
                                        headers: ${headers},
                                        body: '${data}'
                                    });
                                    const data = (await res.json())
                                    onChange(data)
                                }catch(e){
                                    message.error(e.message);
                                }
                            }
                            fdata();
                       },[condition]);
                       return React.createElement(children.type, {...children.props, value, onChange});
                    }
                `;

            }
            return code;
        }
    }
}