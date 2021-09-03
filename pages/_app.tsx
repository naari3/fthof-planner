import React, { useEffect } from "react";

import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as MUIThemeProvider, StylesProvider } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "fontsource-roboto";

import theme from "../styles/theme";

const MyApp = ({ Component, pageProps }): JSX.Element => {
  // Remove the server-side injected CSS.(https://material-ui.com/guides/server-rendering/)
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </StyledComponentsThemeProvider>
      </MUIThemeProvider>
    </StylesProvider>
  );
};

export default MyApp;
