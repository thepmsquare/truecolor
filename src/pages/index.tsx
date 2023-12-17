import React, { FC, useState, StrictMode } from "react";
import { type HeadFC, type PageProps, navigate } from "gatsby";
import {
  Button,
  Card,
  Link,
  StyledEngineProvider,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import StartIcon from "@mui/icons-material/Start";
import LaunchIcon from "@mui/icons-material/Launch";
import config from "../../config";
import { ThemeToggle, CustomSnackbar } from "squarecomponents";
import type { CustomSnackbarStateType } from "squarecomponents";
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
  const [themeState, changeThemeState] = useState(defaultThemeState);
  const [snackbarState, changeSnackbarState] =
    useState<CustomSnackbarStateType>({
      isOpen: false,
      message: "",
      severity: "error",
    });

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

  // misc
  let currentTheme = createTheme({
    palette: {
      mode: themeState,
    },
    typography: {
      fontFamily: config.defaultFont,
    },
  });
  const breakpointForTitle = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--breakpoint-for-title")
      .trim()
  );
  const documentWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  console.log();

  return (
    <StrictMode>
      <ThemeProvider theme={currentTheme}>
        <StyledEngineProvider injectFirst>
          <Card className="main" square>
            <div className="inside-main">
              <Typography
                variant={breakpointForTitle > documentWidth ? "h2" : "h1"}
                component="h1"
                color="primary"
                title={config.appName}
                className="index-title"
              >
                {config.appName}
              </Typography>
              <Typography variant="subtitle1" align="center" color="primary">
                a singleplayer color quiz.
              </Typography>

              <Button
                fullWidth
                onClick={() => navigateToSinglePlayer(true)}
                endIcon={<StartIcon />}
                size="large"
                variant="contained"
              >
                normal mode
              </Button>

              <Button
                fullWidth
                onClick={() => navigateToSinglePlayer(false)}
                endIcon={<StartIcon />}
                size="large"
                variant="contained"
              >
                challenge mode
              </Button>

              <Link href={config.multiPlayerLink}>
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
          <CustomSnackbar
            snackbarState={snackbarState}
            changeSnackbarState={changeSnackbarState}
          />
        </StyledEngineProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

export default IndexPage;
