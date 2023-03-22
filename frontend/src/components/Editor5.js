import React, { useEffect, useRef, useState } from "react";
import { Backdrop, Box, Button, Typography } from "@mui/material";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/theme/material-ocean.css";
import ACTIONS from "../utils/Actions";
import { useLocation, useNavigate } from "react-router-dom";

function Editor5({ socketRef, codeData, currentFile }) {
  const editorRef = useRef(null);
  const location = useLocation();
  const [bdo, setBdo] = useState(false);
  const navigate = useNavigate();
  console.log(currentFile);

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "material-ocean",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          // readOnly: !loggedInUser,
        }
      );

      editorRef.current.setSize(null, "94vh");

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();

        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            spaceId: location.state.spaceId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    editorRef.current.setValue(codeData);
  }, [codeData]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
  }, [socketRef.current]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: 2, backdropFilter: "blur(4px)" }}
        open={bdo}
      >
        <Box
          sx={{
            width: "25vw",
            backgroundColor: "background.secondary",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          <Typography
            variant="h2"
            sx={{ color: "text.primary", fontSize: 30, fontWeight: 700, mb: 4 }}
          >
            login to edit this space.
          </Typography>

          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              sx={{ height: "43px", mr: 2 }}
              onClick={() => navigate("/login")}
            >
              Create
            </Button>
            <Button
              variant="contained"
              sx={{ height: "43px" }}
              onClick={() => setBdo(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Backdrop>
      <Box
        component="textarea"
        id="realTimeEditor"
        sx={{ height: "94vh" }}
      ></Box>
    </>
  );
}

export default Editor5;
