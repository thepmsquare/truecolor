import React, { FC, useState, StrictMode } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  StyledEngineProvider,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config";
import { ThemeToggle, CustomSnackbar } from "squarecomponents";
import type { CustomSnackbarStateType } from "squarecomponents";
import "../stylesheets/results.css";
import "../stylesheets/common.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>{config.appName}</title>;

const Results: FC<PageProps> = (props) => {
  // get stuff from props
  const propsState: any = props.location.state;
  const propsCurrentScore: number | undefined = propsState?.currentScore;
  const propsCurrentModeEasy: boolean | undefined = propsState?.currentModeEasy;
  if (propsCurrentScore === undefined || propsCurrentModeEasy === undefined) {
    if (isBrowser) {
      navigate("/");
    }
    return "";
  }

  // get stuff from local storage
  let localStorageTheme;
  let localStorageEasyHighScore;
  let localStorageHardHighScore;
  if (isBrowser) {
    localStorageTheme = window.localStorage.getItem("theme");
    localStorageEasyHighScore = window.localStorage.getItem("easy-highscore");
    localStorageHardHighScore = window.localStorage.getItem("hard-highscore");
  } else {
    localStorageTheme = null;
    localStorageEasyHighScore = null;
    localStorageHardHighScore = null;
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
  let newHighScore: number;
  let oldHighScore: number;
  let highScoreChanged: boolean;
  let alternateModeHighScore: number;
  if (propsCurrentModeEasy) {
    if (localStorageEasyHighScore !== null) {
      // second time game over
      oldHighScore = parseInt(localStorageEasyHighScore);
      if (oldHighScore < propsCurrentScore) {
        newHighScore = propsCurrentScore;
        highScoreChanged = true;
        if (isBrowser) {
          window.localStorage.setItem(
            "easy-highscore",
            propsCurrentScore.toString()
          );
        }
      } else {
        newHighScore = oldHighScore;
        highScoreChanged = false;
      }
    } else {
      // first time game over
      oldHighScore = 0;
      newHighScore = propsCurrentScore;
      highScoreChanged = true;
      if (isBrowser) {
        window.localStorage.setItem(
          "easy-highscore",
          propsCurrentScore.toString()
        );
      }
    }
    // alternate mode logic
    if (localStorageHardHighScore !== null) {
      alternateModeHighScore = parseInt(localStorageHardHighScore);
      if (isBrowser) {
        window.localStorage.setItem(
          "hard-highscore",
          localStorageHardHighScore
        );
      }
    } else {
      // alternate mode first time game over
      alternateModeHighScore = 0;
      if (isBrowser) {
        window.localStorage.setItem("hard-highscore", "0");
      }
    }
  } else {
    if (localStorageHardHighScore !== null) {
      // second time game over
      oldHighScore = parseInt(localStorageHardHighScore);
      if (oldHighScore < propsCurrentScore) {
        newHighScore = propsCurrentScore;
        highScoreChanged = true;
        if (isBrowser) {
          window.localStorage.setItem(
            "hard-highscore",
            propsCurrentScore.toString()
          );
        }
      } else {
        newHighScore = oldHighScore;
        highScoreChanged = false;
      }
    } else {
      // first time game over
      oldHighScore = 0;
      newHighScore = propsCurrentScore;
      highScoreChanged = true;
      if (isBrowser) {
        window.localStorage.setItem(
          "hard-highscore",
          propsCurrentScore.toString()
        );
      }
    }
    // alternate mode logic
    if (localStorageEasyHighScore !== null) {
      alternateModeHighScore = parseInt(localStorageEasyHighScore);
      if (isBrowser) {
        window.localStorage.setItem(
          "easy-highscore",
          localStorageEasyHighScore
        );
      }
    } else {
      // alternate mode first time game over
      alternateModeHighScore = 0;
      if (isBrowser) {
        window.localStorage.setItem("easy-highscore", "0");
      }
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

  // ========

  // functions

  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
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

  return (
    <StrictMode>
      <ThemeProvider theme={currentTheme}>
        <StyledEngineProvider injectFirst>
          <Card className="main">
            <Card className="inside-main">
              <CardContent className="cardcontent">
                <Typography>
                  Current mode is{" "}
                  {propsCurrentModeEasy ? "Normal" : "Challenge"}.
                </Typography>
                <Typography>
                  Old highscore in this mode was {oldHighScore}.
                </Typography>
                <Typography>Current score was {propsCurrentScore}.</Typography>
                <Typography>
                  {highScoreChanged
                    ? "Congtratulations on setting a new high score."
                    : "You did not beat your previous high score."}
                </Typography>
                <Typography>
                  High score in {!propsCurrentModeEasy ? "Normal" : "Challenge"}{" "}
                  mode is {alternateModeHighScore}.
                </Typography>

                <ThemeToggle
                  themeState={themeState}
                  customChangeThemeState={customChangeThemeState}
                  variant="text"
                />
              </CardContent>
              <CardActions className="cardactions">
                <Button href="/">play again?</Button>
              </CardActions>
            </Card>
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

export default Results;
