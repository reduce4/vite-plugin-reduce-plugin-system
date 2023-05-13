import { useEffect } from "react";
const formatChats = (chats) => {
  return chats.map((chatMessage, i) => ({
    role: i % 2 == 0 ? "user" : "assistant",
    content: chatMessage,
  }));
};

const useDoChat = ({ hooks, config }) => {
  useEffect(() => {
    if (!hooks.doChat) {
      return;
    }
    const fdata = async () => {
      var cDoChatReturn = [...hooks.doChatReturn, hooks.doChat];
      hooks.setDoChatReturn(cDoChatReturn);

      const readStream = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: config.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: formatChats(cDoChatReturn),
            temperature: 0.7,
            stream: true,
          }),
        }
      ).then((res) => res.body);
      const reader = readStream
        .pipeThrough(new TextDecoderStream())
        .getReader();
      let resChunk = await reader.read();
      var c = [...cDoChatReturn];
      var newIdx = c.length;
      let resPonse = "";
      while (!resChunk.done) {
        const values = resChunk.value
          .trim()
          .replace(/data\:/g, "")
          .trim()
          .split("\n")
          .filter((e) => e);
        if (values[values.length - 1].includes("[DONE]")) {
          break;
        }
        for (var v of values) {
          const choice = JSON.parse(v).choices[0];
          resPonse += choice.delta.content ?? "";
          c[newIdx] = resPonse;
          hooks.setDoChatReturn([...c]);
        }
        resChunk = await reader.read();
      }
    };
    fdata();
  }, [hooks.doChat]);
};
export default useDoChat;
