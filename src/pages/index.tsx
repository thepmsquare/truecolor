import React, { FC, useState, StrictMode, useEffect } from "react";
import { type HeadFC, type PageProps, navigate } from "gatsby";
import {
  Button,
  Card,
  IconButton,
  Link,
  StyledEngineProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import { ThemeToggle } from "squarecomponents";
import "../stylesheets/index.css";
import "../stylesheets/common.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>{config.appName}</title>;

const IndexPage: FC<PageProps> = () => {
  // get stuff from local storage
  let localStorageTheme;
  if (isBrowser) {
    localStorageTheme = window.localStorage.getItem("theme");
  } else {
    localStorageTheme = null;
  }
  let defaultThemeState: "dark" | "light";
  if (localStorageTheme !== null) {
    defaultThemeState = localStorageTheme === "dark" ? "dark" : "light";
  } else {
    defaultThemeState = config.defaultThemeState;
    if (isBrowser) {
      window.localStorage.setItem("theme", config.defaultThemeState);
    }
  }
  // state
  const [isDesktop, changeIsDesktop] = useState(false);
  const [themeState, changeThemeState] = useState(defaultThemeState);

  // functions
  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
  };

  const navigateToSinglePlayer = (isEasyModeOn: boolean) => {
    let state;
    if (isEasyModeOn) {
      state = {
        numColors: 3,
        hints: true,
        numLives: 6,
      };
    } else {
      state = {
        numColors: 6,
        hints: false,
        numLives: 3,
      };
    }
    navigate("/singleplayer/", {
      state,
    });
  };

  const handleResize = () => {
    if (isBrowser) {
      const breakpointForDesktop = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--breakpoint-for-desktop")
          .trim()
      );
      const documentWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (documentWidth > breakpointForDesktop) {
        changeIsDesktop(true);
      } else {
        changeIsDesktop(false);
      }
    }
  };

  // useEffect
  if (isBrowser) {
    useEffect(() => {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
  }

  // misc
  let currentTheme = createTheme({
    palette: {
      mode: themeState,
    },
    typography: {
      fontFamily: config.defaultFont,
    },
  });

  return (
    <StrictMode>
      <ThemeProvider theme={currentTheme}>
        <StyledEngineProvider injectFirst>
          {isDesktop ? (
            <Card className="index" square>
              <div className="index-header">
                <Typography
                  variant="h1"
                  component="h1"
                  title={config.appName}
                  className="index-title"
                >
                  {config.appName}
                </Typography>
                <Typography variant="subtitle1" align="center">
                  a singleplayer color quiz.
                </Typography>
              </div>
              <div className="index-main">
                <div className="index-buttons-container">
                  <Button
                    onClick={() => navigateToSinglePlayer(false)}
                    size="large"
                    variant="outlined"
                    color="inherit"
                  >
                    challenge mode
                  </Button>
                  <Button
                    onClick={() => navigateToSinglePlayer(true)}
                    size="large"
                    variant="outlined"
                    color="inherit"
                  >
                    normal mode
                  </Button>
                </div>
                <Button
                  fullWidth
                  color="inherit"
                  href={config.multiPlayerLink}
                  target="_blank"
                  disabled
                >
                  multicolor
                </Button>
                <Button fullWidth color="inherit">
                  instructions
                </Button>
                <ThemeToggle
                  themeState={themeState}
                  customChangeThemeState={customChangeThemeState}
                  downArrowIcon={true}
                  color="inherit"
                  fullwidth
                />
              </div>
            </Card>
          ) : (
            <Card className="index-phone" square>
              <div className="index-center-phone">
                <Typography
                  variant="h2"
                  component="h1"
                  title={config.appName}
                  className="index-title-phone"
                >
                  {config.appName}
                </Typography>
                <Typography variant="subtitle1" align="center" gutterBottom>
                  a singleplayer color quiz.
                </Typography>
              </div>

              <div className="index-buttons-container-phone">
                <ThemeToggle
                  themeState={themeState}
                  customChangeThemeState={customChangeThemeState}
                  downArrowIcon={true}
                  color="inherit"
                  fullwidth
                />
                <Button color="inherit">instructions</Button>
                <Button
                  href={config.multiPlayerLink}
                  color="inherit"
                  target="_blank"
                  disabled
                >
                  multicolor
                </Button>
                <Button
                  onClick={() => navigateToSinglePlayer(false)}
                  size="large"
                  variant="outlined"
                  color="inherit"
                >
                  challenge mode
                </Button>
                <Button
                  onClick={() => navigateToSinglePlayer(true)}
                  size="large"
                  variant="outlined"
                  color="inherit"
                >
                  normal mode
                </Button>
              </div>
            </Card>
          )}
        </StyledEngineProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

export default IndexPage;
