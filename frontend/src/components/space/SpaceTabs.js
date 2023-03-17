import React from "react";
import { OpenStyledTab, OpenStyledTabs } from "../../reuseable";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function SpaceTabs({ topTabsData, value, dispatch, spaceData }) {
  const closeOpenTab = (id) => {
    const i = topTabsData.findIndex((x) => x.id === id);
    let newarr = topTabsData.filter((item) => item.id !== id);
    dispatch({ type: "updateTabsData", payload: newarr });
    dispatch({ type: "updateTopTab", payload: i === 0 ? i : i - 1 });
    dispatch({
      type: "updateEditorLanguage",
      payload: i === 0 ? topTabsData[i].lang : topTabsData[i - 1].lang,
    }); // Error if i-1 < 0
    const si = spaceData.findIndex(
      (x) => x.id === (i === 0 ? topTabsData[i].id : topTabsData[i - 1].id)
    ); // Error if i-1 < 0
    dispatch({ type: "updateSideTab", payload: si });
  };

  const changeFile = (event, newValue) => {
    dispatch({ type: "updateTopTab", payload: newValue });
    const obj = topTabsData[newValue];
    const i = spaceData.findIndex((x) => x.id === obj.id);
    dispatch({ type: "updateSideTab", payload: i });
  };

  return (
    <>
      {topTabsData && topTabsData.length > 0 && (
        <OpenStyledTabs
          value={value}
          onChange={changeFile}
          variant="scrollable"
          scrollButtons="auto"
        >
          {topTabsData.map((item, id) => {
            return (
              <OpenStyledTab
                disableRipple
                label={
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {item.fileName}
                    <Box>
                      <IconButton
                        component="span"
                        sx={{ ml: 1 }}
                        onClick={() => closeOpenTab(item.id)}
                      >
                        <CloseIcon sx={{ fontSize: "20px" }} />
                      </IconButton>
                    </Box>
                  </Box>
                }
                key={id}
              />
            );
          })}
        </OpenStyledTabs>
      )}
    </>
  );
}

export default SpaceTabs;
