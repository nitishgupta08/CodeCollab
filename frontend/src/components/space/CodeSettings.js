import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
  Slider,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function CodeSettings({
  language,
  fileName,
  cursorPosition,
  dispatch,
  theme,
  fontSize,
  spaceName,
}) {
  const [edit, setEdit] = useState(false);
  const [editName, setEditName] = useState("");

  return (
    <Box
      sx={{
        backgroundColor: "background.secondary",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pl: 2,
        pr: 2,
        pt: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}
        >
          {spaceName}
        </Typography>
        <NavigateNextIcon fontSize="small" sx={{ color: "text.primary" }} />
        {edit ? (
          <TextField
            size="small"
            name="name"
            sx={{ width: "100%" }}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        ) : (
          <Typography
            variant="h2"
            sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}
          >
            {fileName}
          </Typography>
        )}

        {edit ? (
          <Box sx={{ display: "flex" }}>
            <IconButton
              sx={{ ml: 2 }}
              onClick={() => {
                dispatch({ type: "updateFileName", payload: editName });
                setEdit(false);
              }}
            >
              <CheckIcon sx={{ color: "success.main", fontSize: 20 }} />
            </IconButton>
            <IconButton onClick={() => setEdit(false)}>
              <CloseIcon sx={{ color: "error.main", fontSize: 20 }} />
            </IconButton>
          </Box>
        ) : (
          <IconButton sx={{ ml: 1 }} onClick={() => setEdit(true)}>
            <EditIcon
              sx={{ color: "text.primary", opacity: 0.7, fontSize: 15 }}
            />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: 15,
            fontWeight: 500,
            color: "text.primary",
            mr: 2,
            opacity: 0.7,
          }}
        >
          {cursorPosition}
        </Typography>

        <SelectLanguage language={language} dispatch={dispatch} />

        <Divider orientation="vertical" flexItem sx={{ opacity: 0.7 }} />
        <AdjustFontSize fontSize={fontSize} dispatch={dispatch} />
        <SelectTheme theme={theme} dispatch={dispatch} />
      </Box>
    </Box>
  );
}

const SelectLanguage = ({ language, dispatch }) => {
  return (
    <FormControl sx={{ minWidth: 120, mr: 2 }} size="small">
      <Select
        value={language}
        onChange={(e) =>
          dispatch({ type: "updateLanguage", payload: e.target.value })
        }
        displayEmpty
      >
        <MenuItem value={"cpp"}>C++</MenuItem>
        <MenuItem value={"javascript"}>Javascript</MenuItem>
        <MenuItem value={"python"}>Python</MenuItem>
      </Select>
    </FormControl>
  );
};

const SelectTheme = ({ theme, dispatch }) => {
  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <Select
        value={theme}
        onChange={(e) =>
          dispatch({ type: "updateTheme", payload: e.target.value })
        }
        displayEmpty
      >
        <ListSubheader
          sx={{
            opacity: 0.5,
          }}
        >
          Light
        </ListSubheader>
        <MenuItem value={"githubLight"}>Github Light</MenuItem>
        <MenuItem value={"tokyoNightDay"}>Tokyo Night Day</MenuItem>
        <MenuItem value={"xcodeLight"}>Xcode Light</MenuItem>
        <ListSubheader
          sx={{
            opacity: 0.5,
          }}
        >
          Dark
        </ListSubheader>
        <MenuItem value={"aura"}>Aura</MenuItem>
        <MenuItem value={"dracula"}>Dracula</MenuItem>
        <MenuItem value={"githubDark"}>Github Dark</MenuItem>
        <MenuItem value={"tokyoNight"}>Tokyo Night</MenuItem>
        <MenuItem value={"tokyoNightStorm"}>Tokyo Night Storm</MenuItem>
        <MenuItem value={"vscodeDark"}>VSCode Dark</MenuItem>
        <MenuItem value={"xcodeDark"}>Xcode Dark</MenuItem>
      </Select>
    </FormControl>
  );
};

const AdjustFontSize = ({ fontSize, dispatch }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mr: 2, ml: 2 }}>
      <TextDecreaseIcon sx={{ mr: 2, color: "text.primary" }} />
      <Slider
        defaultValue={15}
        size="small"
        step={1}
        min={13}
        max={17}
        value={fontSize}
        onChange={(e) =>
          dispatch({
            type: "updateFontSize",
            payload: e.target.value === "" ? "" : Number(e.target.value),
          })
        }
        marks
        sx={{ minWidth: "100px" }}
      />
      <TextIncreaseIcon sx={{ ml: 2, color: "text.primary" }} />
    </Box>
  );
};
