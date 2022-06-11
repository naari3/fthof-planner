import { Container, AppBar, Typography, Toolbar } from "@mui/material";

export default function Layout({ children }) {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>fthof-planner</Typography>
          <Typography>Support for v 2.048</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ height: "12px" }}></div>
      <Container>{children}</Container>
    </>
  );
}
