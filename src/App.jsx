import ChatGpt from "./pages/chatgpt";
import Dsl from "./dsl/dsl";
const App = () => {
  return (
    <>
      <Dsl>
        <ChatGpt />
      </Dsl>
    </>
  );
};
export default App;
