import { Box } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { CustomTextField } from "../../reuseable";
import LoadingCard from "./LoadingCard";
import SpaceCard from "./SpaceCard";

function ListSpaces({
  setMessage,
  setSuccess,
  setError,
  loggedInUser,
  listSpaces: listSpace,
  dashboardDispatch,
}) {
  return (
    <>
      <Box sx={{ pl: 5, pr: 5 }}>
        {listSpace !== undefined ? (
          listSpace.length === 0 ? (
            <>
              <Box
                component="img"
                sx={{
                  height: 500,
                  display: "block",
                  ml: "auto",
                  mr: "auto",
                  width: "50%",
                }}
                alt="No spaces found"
                src="/no_data.png"
              />
            </>
          ) : (
            <Box>
              {listSpace.map((item, id) => {
                return (
                  <SpaceCard
                    key={id}
                    item={item}
                    loggedInUser={loggedInUser}
                    setMessage={setMessage}
                    setSuccess={setSuccess}
                    setError={setError}
                    dashboardDispatch={dashboardDispatch}
                  />
                );
              })}
            </Box>
          )
        ) : (
          <LoadingCard />
        )}
      </Box>
    </>
  );
}

export default ListSpaces;
