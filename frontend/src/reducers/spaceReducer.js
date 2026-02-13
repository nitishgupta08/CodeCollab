const INITIAL_STATE = {
  spaceData: [],
  currentData: null,
  loadingScreen: true,
  spaceName: "",
  activeUsers: [],
  successSnackbar: false,
  failSnackbar: false,
  message: { title: "", data: "" },
  language: "javascript",
  theme: "aura",
  cursorPosition: "1:1",
  fontSize: 15,
  canEdit: false,
};

function spaceReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "updateSpaceData":
      if (action.payload === state.spaceData) {
        return state;
      }
      return { ...state, spaceData: action.payload };
    case "updateCurrentData":
      if (!action.payload && !state.currentData) {
        return state;
      }

      if (action.payload && state.currentData) {
        const sameCurrentData =
          action.payload._id === state.currentData._id &&
          action.payload.fileData === state.currentData.fileData &&
          action.payload.fileLang === state.currentData.fileLang &&
          action.payload.fileName === state.currentData.fileName;

        if (sameCurrentData) {
          return state;
        }
      }
      return { ...state, currentData: action.payload };
    case "syncFileMetadata":
      return {
        ...state,
        currentData: state.currentData
          ? {
              ...state.currentData,
              fileLang: action.payload.fileLang,
              fileName: action.payload.fileName,
            }
          : state.currentData,
        language: action.payload.fileLang,
      };
    case "removeLoadingScreen":
      return { ...state, loadingScreen: false };
    case "updateSpaceName":
      return { ...state, spaceName: action.payload };
    case "updateSuccess":
      return { ...state, successSnackbar: action.payload };
    case "updateFail":
      return { ...state, failSnackbar: action.payload };
    case "updateMessage":
      return { ...state, message: action.payload };
    case "updateActiveUsers":
      return { ...state, activeUsers: action.payload };
    case "updateLanguage":
      if (action.payload === state.language) {
        return state;
      }
      return { ...state, language: action.payload };
    case "updateTheme":
      if (action.payload === state.theme) {
        return state;
      }
      return { ...state, theme: action.payload };
    case "updateCursorPosition":
      if (action.payload === state.cursorPosition) {
        return state;
      }
      return { ...state, cursorPosition: action.payload };
    case "updateFontSize":
      if (action.payload === state.fontSize) {
        return state;
      }
      return { ...state, fontSize: action.payload };
    case "updateCanEdit":
      if (action.payload === state.canEdit) {
        return state;
      }
      return { ...state, canEdit: action.payload };
    case "resetSpaceState":
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default spaceReducer;
