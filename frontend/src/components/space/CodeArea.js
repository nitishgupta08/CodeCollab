import { Box } from "@mui/material";
import CodeSettings from "./CodeSettings";
import Editor from "./Editor";


export default function CodeArea({ spaceId }) {
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
        spaceId={spaceId}
      />
      <CodeSettings/>
    </Box>
  );
}
