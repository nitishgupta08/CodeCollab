import { useCallback, useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Box } from "@mui/material";
import { pythonLanguage } from "@codemirror/lang-python";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { cppLanguage } from "@codemirror/lang-cpp";
import { LanguageSupport } from "@codemirror/language";
import { xcodeLight, xcodeDark } from "@uiw/codemirror-theme-xcode";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { aura } from "@uiw/codemirror-theme-aura";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { socket } from "../../scoket";
import ACTIONS from "../../utils/Actions";

const languageExtensions = {
  javascript: [new LanguageSupport(javascriptLanguage)],
  python: [new LanguageSupport(pythonLanguage)],
  cpp: [new LanguageSupport(cppLanguage)],
};

const themeExtensions = {
  xcodeLight,
  xcodeDark,
  githubDark,
  githubLight,
  dracula,
  aura,
  tokyoNight,
  tokyoNightStorm,
  tokyoNightDay,
  vscodeDark,
};

export default function Editor({
  value,
  editorDispatch,
  language,
  theme,
  fontSize,
  spaceId,
}) {
  const [pos, setPos] = useState("1:1");
  const onChange = useCallback((value, viewUpdate) => {
    console.log(viewUpdate);
    socket.emit(ACTIONS.CODE_CHANGE, {
      spaceId,
      change: viewUpdate.state.toJSON().doc,
    });
  }, []);

  useEffect(() => {
    editorDispatch({
      type: "updateCursorPosition",
      payload: pos,
    });
  }, [pos]);

  return (
    <Box>
      <CodeMirror
        value={value}
        autoFocus={true}
        onStatistics={(data) => {
          setPos(`${data.line.number}:${data.line.to - data.line.from + 1}`);
        }}
        height="calc(100vh - 128px)"
        theme={themeExtensions[theme]}
        extensions={[...languageExtensions[language]]}
        onChange={onChange}
        style={{
          fontSize: fontSize,
        }}
      />
    </Box>
  );
}
