import { useContext } from "react";
import { EditorContext } from "../context/editorContext";

export const useEditorContext = () => useContext(EditorContext);
