import { Card, Input, Button, Row, Col } from "antd";
import { useState } from "react";
const Chatgpt = ({ value, onChange }) => {
  const [inputMsg, setInputMsg] = useState();
  return (
    <>
      <Card title="chatgpt">
        <Input.TextArea
          value={value?.data?.postData?.time ?? ""}
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
                var c = { ...value };
                c.data.postData.time = inputMsg;
                onChange(c);
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
