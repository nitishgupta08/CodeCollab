import { useEffect, useReducer, useState } from "react";
import { Box } from "@mui/material";
import CodeSettings from "./CodeSettings";
import Editor from "./Editor";

const initialState = {
  fileData: "",
  fileName: "",
  language: "javascript",
  theme: "aura",
  cursorPosition: "1:1",
  fontSize: 15,
};

function reducer(state, action) {
  switch (action.type) {
    case "updateFileData":
      return { ...state, fileData: action.payload };
    case "updateFileName":
      return { ...state, fileName: action.payload };
    case "updateLanguage":
      return { ...state, language: action.payload };
    case "updateTheme":
      return { ...state, theme: action.payload };
    case "updateCursorPosition":
      return { ...state, cursorPosition: action.payload };
    case "updateFontSize":
      return { ...state, fontSize: action.payload };
    default:
      throw new Error();
  }
}

export default function CodeArea({ spaceData, spaceName, spaceId }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (spaceData) {
      dispatch({ type: "updateFileData", payload: spaceData.fileData });
      dispatch({ type: "updateFileName", payload: spaceData.fileName });
    }
  }, [spaceData]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh - 80px)",
        borderRadius: 4,
        backgroundColor: "grey.900",
      }}
    >
      <Editor
        value={state.fileData}
        editorDispatch={dispatch}
        language={state.language}
        theme={state.theme}
        fontSize={state.fontSize}
        spaceId={spaceId}
      />
      <CodeSettings
        fileName={state.fileName}
        language={state.language}
        cursorPosition={state.cursorPosition}
        dispatch={dispatch}
        theme={state.theme}
        fontSize={state.fontSize}
        spaceName={spaceName}
      />
    </Box>
  );
}
