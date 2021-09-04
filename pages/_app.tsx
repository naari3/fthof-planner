import React, { useEffect } from "react";
// import { useMemo, useState } from "react";

import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as MUIThemeProvider, StylesProvider } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
// import { createTheme, useMediaQuery } from "@mui/material";
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

  //   const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  //   const [darkMode, setDarkMode] = useState(prefersDarkMode);
  //   console.log(prefersDarkMode);

  //   const theme = useMemo(
  //     () =>
  //       createTheme({
  //         palette: {
  //           mode: darkMode ? "dark" : "light",
  //         },
  //       }),
  //     []
  //   );

  //   useEffect(() => {
  //     setDarkMode(prefersDarkMode);
  //   }, [prefersDarkMode]);
  //   const handleDarkModeToggle = () => {
  //     setDarkMode(!darkMode);
  //   };

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
