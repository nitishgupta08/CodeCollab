import { useEffect, useReducer, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useAxios } from "../hooks/useAxios";
import { Grid } from "@mui/material";
import SpaceHeader from "../components/space/SpaceHeader";
import { UserContext } from "../context/UserContext";
import CodeArea from "../components/space/CodeArea";

const initialState = {
  spaceData: null,
  loadingScreen: true,
  spaceName: "",
  currentFileData: "",
  activeUsers: null,
  editorTheme: "",
  editorLanguageIndex: 0,
  successSnackbar: false,
  failSnackbar: false,
  sideTabValue: 0,
  message: { title: "", data: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "updateSpaceData":
      return { ...state, spaceData: action.payload };
    case "removeLoadingScreen":
      return { ...state, loadingScreen: false };
    case "updateSpaceName":
      return { ...state, spaceName: action.payload };
    case "updateSideTab":
      return { ...state, sideTabValue: action.payload };
    case "updateEditorTheme":
      return { ...state, editorTheme: action.payload };
    case "updateEditorLanguage":
      return { ...state, editorLanguageIndex: action.payload };
    case "updateCurrentFileData":
      return { ...state, currentFileData: action.payload };
    case "updateSuccess":
      return { ...state, successSnackbar: action.payload };
    case "updateFail":
      return { ...state, failSnackbar: action.payload };
    case "updateMessage":
      return { ...state, message: action.payload };
    case "updateActiveUsers":
      return { ...state, activeUsers: action.payload };
    default:
      throw new Error();
  }
}

function Space() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  const { loggedInUser } = useContext(UserContext);

  const { response, error } = useAxios({
    method: "GET",
    url: `/spaces/${location.state.spaceId}`,
  });

  useEffect(() => {
    if (error !== undefined) {
      // Show feedback to user
      console.log(error.response.data);
      return;
    }

    if (response === undefined) return;

    dispatch({ type: "updateSpaceData", payload: response.data });
    dispatch({ type: "removeLoadingScreen", payload: false });
  }, [response, error]);

  return (
    <>
      <Grid container>
        <Grid item xs={12} sx={{ height: "10vh" }}>
          <SpaceHeader loggedInUser={loggedInUser} />
        </Grid>

        <Grid item xs={12} sx={{ height: "90vh" }}>
          <CodeArea />
        </Grid>
      </Grid>
    </>
  );
}

export default Space;
