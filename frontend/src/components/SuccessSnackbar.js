import { Alert, AlertTitle, Snackbar } from "@mui/material";

const SuccessSnackbar = ({ open, close, title, message }) => {
  return (
    <Snackbar
      open={open}
      onClose={() => close()({ type: "updateSuccess", payload: false })}
      // TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={2500}
    >
      <Alert onClose={() => close} severity="success" sx={{ width: "100%" }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;
