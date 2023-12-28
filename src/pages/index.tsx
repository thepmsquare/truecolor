import React, { FC, useState, StrictMode, useEffect } from "react";
import { type HeadFC, type PageProps, navigate } from "gatsby";
import {
  Button,
  Card,
  Link,
  StyledEngineProvider,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LaunchIcon from "@mui/icons-material/Launch";
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
  type variantForTitle = "h1" | "h2";
  const [titleComponent, changeTitleComponent] =
    useState<variantForTitle>("h2");
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
      const breakpointForTitle = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--breakpoint-for-title")
          .trim()
      );
      const documentWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (documentWidth > breakpointForTitle) {
        changeTitleComponent("h1");
      } else {
        changeTitleComponent("h2");
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
          <Card className="index" square>
            <div className="index-header">
              <Typography
                variant={titleComponent}
                component="h1"
                title={config.appName}
                className="index-title"
                color="primary"
              >
                {config.appName}
              </Typography>
              <Typography variant="subtitle1" align="center" color="secondary">
                a singleplayer color quiz.
              </Typography>
            </div>
            <div className="index-main">
              <div className="index-buttons-container">
                <Button
                  onClick={() => navigateToSinglePlayer(true)}
                  size="large"
                  variant="contained"
                >
                  normal mode
                </Button>

                <Button
                  onClick={() => navigateToSinglePlayer(false)}
                  size="large"
                  variant="outlined"
                  color="error"
                >
                  challenge mode
                </Button>
              </div>
              <Link href={config.multiPlayerLink} target="_blank">
                <Button fullWidth endIcon={<LaunchIcon />} color="secondary">
                  multicolor
                </Button>
              </Link>

              <ThemeToggle
                themeState={themeState}
                customChangeThemeState={customChangeThemeState}
                variant="text"
              />
            </div>
          </Card>
        </StyledEngineProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

export default IndexPage;
