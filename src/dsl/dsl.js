export default {
    "api": {
        "method": "POST",
        "hooks": [
            { "name": "doChat", "initValue": null, "payloadType": "string", "i18n": "聊天" }
        ],
        "url": "http://localhost:10000/api",
        "headers": {
            "token": "${token}"
        },
        "data": {
            "msg": "${value['@reduce/chatgpt@0.0.0'].conditon.msg}"
        }
    }
}