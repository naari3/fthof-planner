import { Container, AppBar, Typography, Toolbar } from "@material-ui/core";

export default function Layout({ children }) {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography>fthof-planner</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <main>{children}</main>
      </Container>
    </>
  );
}
