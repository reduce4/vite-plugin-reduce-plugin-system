import { Card, Input, Button, Row, Col } from "antd";
import useDoChat from "../hooks/useDoChat";
const formatDoChatReturn = (chats) => {
  return chats.reduce((v, t, i) => {
    return v + `${i % 2 == 0 ? "我" : "chatgpt"}说: ${t}` + "\n";
  }, "");
};
const Chatgpt = ({ hooks, config }) => {
  useDoChat({
    hooks,
    config,
  });
  return (
    <>
      <Card title="chatgpt">
        <Input.TextArea
          value={formatDoChatReturn(hooks.doChatReturn)}
          autoSize
          style={{
            minHeight: "200px",
          }}
        ></Input.TextArea>
        <Row>
          <Col span={23}>
            <Input
              value={hooks.doType}
              onChange={({ target: { value } }) => hooks.setDoType(value)}
            />
          </Col>
          <Col span={1}>
            <Button
              type="primary"
              onClick={() => {
                hooks.setDoChat(hooks.doType);
                hooks.setDoType("");
              }}
            >
              submit
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default Chatgpt;
