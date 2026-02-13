import { Box, Stack } from "@mui/material";
import React from "react";
import LoadingCard from "./LoadingCard";
import SpaceCard from "./SpaceCard";

function ListSpaces({
  setMessage,
  setSuccess,
  setError,
  loggedInUser,
  listSpaces: listSpace,
  dispatch,
}) {
  return (
    <>
      <Box
        sx={{
          px: { xs: 1, sm: 3, md: 5 },
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {listSpace !== undefined ? (
          listSpace.length === 0 ? (
            <Stack sx={{ width: "100%", alignItems: "center" }}>
              <Box
                component="img"
                sx={{
                  height: { xs: 280, sm: 500 },
                  display: "block",
                  ml: "auto",
                  mr: "auto",
                  width: { xs: "90%", sm: "50%" },
                }}
                alt="No spaces found"
                src="/no_data.png"
              />
            </Stack>
          ) : (
            <Stack spacing={1.5} sx={{ width: "100%", maxWidth: "1100px" }}>
              {listSpace.map((item, id) => {
                return (
                  <SpaceCard
                    key={id}
                    item={item}
                    loggedInUser={loggedInUser}
                    setMessage={setMessage}
                    setSuccess={setSuccess}
                    setError={setError}
                    dispatch={dispatch}
                  />
                );
              })}
            </Stack>
          )
        ) : (
          <Stack sx={{ width: "100%", maxWidth: "1100px" }}>
            {[0, 1, 2].map((item) => (
              <LoadingCard key={item} />
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
}

export default ListSpaces;
