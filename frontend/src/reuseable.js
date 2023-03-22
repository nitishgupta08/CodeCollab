import { styled } from "@mui/material/styles";
import { TextField, Tooltip, Tabs, Tab } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";

const CustomInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.secondary,
    fontSize: 16,
    padding: 13,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 4,
      borderColor: theme.palette.primary.main,
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({}) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#181b66",
    color: "#EAE8EE",
    minWidth: 220,
    fontSize: 15,
    p: 1,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#181b66",
  },
}));

export { CustomInput, HtmlTooltip };
