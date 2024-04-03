import Editor from "./pages/editor";
import { EditorContextProvider } from "./context/editorContext";

function App() {
  return (
    <EditorContextProvider>
      <Editor />
    </EditorContextProvider>
  );
}

export default App;
