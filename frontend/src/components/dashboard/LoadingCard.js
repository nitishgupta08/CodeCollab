import { Card, CardActions, CardContent, Skeleton, Stack, Box } from "@mui/material";

export default function LoadingCard() {
  return (
    <Card
      sx={{
        mb: 2,
        p: 1.5,
        boxShadow:
          "0px 2.3px 4.5px rgba(0, 0, 0, 0.07),0px 6.3px 12.5px rgba(0, 0, 0, 0.046),0px 15.1px 30.1px rgba(0, 0, 0, 0.035),0px 50px 100px rgba(0, 0, 0, 0.024)",
        backgroundColor: "background.paper",
        width: "100%",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={1}
      >
        <CardContent sx={{ pb: "16px !important", width: "100%" }}>
          <Skeleton
            animation="wave"
            variant="text"
            width="55%"
            sx={{ fontSize: 20, mb: 1 }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width="70%"
            sx={{ fontSize: 15, mb: 1 }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width="45%"
            sx={{ fontSize: 11 }}
          />
        </CardContent>
        <CardActions sx={{ alignSelf: { xs: "stretch", md: "auto" } }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
          </Box>
        </CardActions>
      </Stack>
    </Card>
  );
}
