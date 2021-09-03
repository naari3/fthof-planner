import { Container, AppBar, Typography, Toolbar } from "@mui/material";

export default function Layout({ children }) {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography>fthof-planner</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ height: "12px" }}></div>
      <Container>{children}</Container>
    </>
  );
}
