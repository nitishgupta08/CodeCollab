import { useCallback, useEffect, useMemo, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Box } from "@mui/material";
import { pythonLanguage } from "@codemirror/lang-python";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { cppLanguage } from "@codemirror/lang-cpp";
import { javaLanguage } from "@codemirror/lang-java";
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
import { useDispatch, useSelector } from "react-redux";

const languageExtensions = {
  javascript: [new LanguageSupport(javascriptLanguage)],
  python: [new LanguageSupport(pythonLanguage)],
  cpp: [new LanguageSupport(cppLanguage)],
  java: [new LanguageSupport(javaLanguage)],
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

export default function Editor({ spaceId }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.spaceReducer);
  const currentDataRef = useRef(state.currentData);
  const cursorValueRef = useRef("1:1");
  const cursorTimerRef = useRef(null);
  const lastDispatchCursorRef = useRef("1:1");
  const seqRef = useRef(0);
  const logBudgetRef = useRef(0);

  useEffect(() => {
    currentDataRef.current = state.currentData;
  }, [state.currentData]);

  const extension = useMemo(
    () => languageExtensions[state.language] || languageExtensions.javascript,
    [state.language]
  );

  const theme = useMemo(
    () => themeExtensions[state.theme] || themeExtensions.aura,
    [state.theme]
  );

  const logDev = useCallback((message, context = {}) => {
    if (!import.meta.env.DEV || logBudgetRef.current > 3) return;
    logBudgetRef.current += 1;
    console.warn(`[Editor] ${message}`, context);
  }, []);

  const dispatchCursor = useCallback((nextPos) => {
    if (nextPos === lastDispatchCursorRef.current) return;
    lastDispatchCursorRef.current = nextPos;
    dispatch({
      type: "updateCursorPosition",
      payload: nextPos,
    });
  }, [dispatch]);

  const onChange = useCallback((value, viewUpdate) => {
    if (!state.canEdit) {
      return;
    }

    if (typeof value !== "string") {
      logDev("Skipping non-string editor payload", { type: typeof value });
      return;
    }

    if (viewUpdate && !viewUpdate.docChanged) {
      return;
    }

    const current = currentDataRef.current;
    if (!current) return;
    if (current.fileData === value) return;

    const nextSeq = seqRef.current + 1;
    seqRef.current = nextSeq;

    dispatch({
      type: "updateCurrentData",
      payload: { ...current, fileData: value },
    });

    socket.emit(ACTIONS.CODE_CHANGE, {
      spaceId,
      change: value,
      seq: nextSeq,
      clientId: socket.id || "unknown",
      origin: "editor",
      timestamp: Date.now(),
    });
  }, [dispatch, logDev, spaceId, state.canEdit]);

  useEffect(() => {
    return () => {
      if (cursorTimerRef.current) {
        clearTimeout(cursorTimerRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <CodeMirror
        value={state.currentData?.fileData}
        autoFocus={true}
        readOnly={!state.canEdit}
        onStatistics={(data) => {
          try {
            if (!data?.line) return;

            const column = data.line.to - data.line.from + 1;
            const nextPos = `${data.line.number}:${column}`;
            if (nextPos === cursorValueRef.current) return;

            cursorValueRef.current = nextPos;
            if (cursorTimerRef.current) {
              clearTimeout(cursorTimerRef.current);
            }
            cursorTimerRef.current = setTimeout(() => {
              dispatchCursor(nextPos);
            }, 100);
          } catch (error) {
            logDev("Cursor statistics callback failed", { error: `${error}` });
          }
        }}
        height="calc(100vh - 128px)"
        theme={theme}
        extensions={extension}
        onChange={onChange}
        style={{
          fontSize: state.fontSize,
        }}
      />
    </Box>
  );
}
