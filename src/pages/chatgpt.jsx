import { Card, Input, Button, Row, Col } from "antd";
import { useState } from "react";
const Chatgpt = ({ value, onChange }) => {
  const [inputMsg, setInputMsg] = useState();
  return (
    <>
      <Card title="chatgpt">
        <Input.TextArea
          value={value?.["@reduce/chatgpt@0.0.0"]?.data?.condition?.msg ?? ""}
          autoSize
          style={{
            minHeight: "200px",
          }}
        ></Input.TextArea>
        <Row>
          <Col span={23}>
            <Input
              value={inputMsg}
              onChange={({ target: { value } }) => setInputMsg(value)}
            />
          </Col>
          <Col span={1}>
            <Button
              type="primary"
              onClick={() => {
                var c = value["@reduce/chatgpt@0.0.0"];
                onChange({
                  ...c,
                  data: {
                    ...c.data,
                    conditon: { ...condition, msg: inputMsg },
                  },
                });
                setInputMsg();
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
