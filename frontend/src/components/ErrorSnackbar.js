import { Alert, AlertTitle, Snackbar } from "@mui/material";

const ErrorSnackbar = ({ open, close, title, message }) => {
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
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
