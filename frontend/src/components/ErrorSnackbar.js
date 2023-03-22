import { Alert, AlertTitle, Snackbar } from "@mui/material";

const ErrorSnackbar = ({ open, close, title, data }) => {
  return (
    <Snackbar
      open={open}
      onClose={() => close(false)}
      // TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
    >
      <Alert severity="error" sx={{ width: "100%" }}>
        <AlertTitle>{title}</AlertTitle>
        {data}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
