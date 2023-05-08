const { Button, Input } = require("antd");
const { default: TextArea } = require("antd/es/input/TextArea");
const { useEffect, useState } = require("react");

const dsl = {
  hooks: {
    doChat: {
      name: "doChat",
      initValue: null,
      payloadType: "string",
      hooksMeans: "设置聊天的内容",
      hooksReturnMeans: "聊天内容的状态",
    },
    doSend: {
      name: "doSend",
      initValue: null,
      payloadType: "string",
      hooksMeans: "发送聊天的内容",
      hooksReturnMeans: "chatgpt返回的内容",
    },
  },
  config: {
    token: "",
  },
};

const useDoSend = (sendMsg, setReturnMsg, token) => {
  useEffect(() => {
    if (!sendMsg) {
      return;
    }
    const fdata = async () => {
      const res = await fetch({
        body: {
          token,
        },
      });
      setReturnMsg(res);
    };
    fdata();
  }, [sendMsg]);
};
const Chatgpt = ({ hooks, config }) => {
  useDoSend(hooks.doSend, hooks.setDoSend, config.token);
  return (
    <>
      <TextArea value={hooks.doSend}></TextArea>
      <Input value={hooks.doChat} onChange={hooks.setDoChat}></Input>
      <Button onClick={() => hooks.setDoSend(hooks.doChat)}>chat</Button>
    </>
  );
};

const ChatgptService = () => {
  const [doChat, setDoChat] = useState(dsl.hooks.doChat.initValue);
  const [doSend, setDoSend] = useState(dsl.hooks.doSend.initValue);
  const [config, setConfig] = useState(dsl.config);
  return <Chatgpt hooks={{ doChat, doSend, setDoChat, setDoSend, config }} />;
};
