import { Container, AppBar, Typography, Toolbar } from "@material-ui/core";

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
