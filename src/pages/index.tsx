import React, { FC, useState, StrictMode, useRef } from "react";
import { type HeadFC, type PageProps, navigate } from "gatsby";
import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  FormControl,
  FormLabel,
  Menu,
  MenuItem,
  StyledEngineProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
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
  // TODO get from localstorage
  const [isSinglePlayerSettingsOpen, changeIsSinglePlayerSettingsOpen] =
    useState(false);
  const [singleplayerNumColors, changeSingleplayerNumColors] = useState(3);
  const [singleplayerHints, changeSingleplayerHints] = useState(true);
  const [singleplayerNumLives, changeSingleplayerNumLives] = useState(3);

  // functions

  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
  };

  const navigateToSinglePlayer = () => {
    navigate("/singleplayer/", {
      state: {
        numColors: singleplayerNumColors,
        hints: singleplayerHints,
        numLives: singleplayerNumLives,
      },
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
  let singleplayerSettingsMenuRef = useRef(null);
  return (
    <StrictMode>
      <ThemeProvider theme={currentTheme}>
        <StyledEngineProvider injectFirst>
          <Card className="main" square>
            <div className="inside-main">
              <Typography variant="h1" color="primary">
                {config.appName}
              </Typography>

              <ButtonGroup>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={navigateToSinglePlayer}
                >
                  singleplayer
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  ref={singleplayerSettingsMenuRef}
                  onClick={() => changeIsSinglePlayerSettingsOpen(true)}
                >
                  <SettingsIcon fontSize="small" />
                </Button>
              </ButtonGroup>

              <Menu
                open={isSinglePlayerSettingsOpen}
                anchorEl={singleplayerSettingsMenuRef.current}
                onClose={() => changeIsSinglePlayerSettingsOpen(false)}
              >
                <MenuItem dense disableRipple>
                  <FormControl>
                    <FormLabel>number of options</FormLabel>
                    <ToggleButtonGroup
                      exclusive
                      value={singleplayerNumColors}
                      onChange={(_, value) =>
                        changeSingleplayerNumColors(value)
                      }
                    >
                      <ToggleButton value={3}>three</ToggleButton>
                      <ToggleButton value={6}>six</ToggleButton>
                    </ToggleButtonGroup>
                  </FormControl>
                </MenuItem>
                <Divider />
                <MenuItem dense disableRipple>
                  <FormControl>
                    <FormLabel>hints</FormLabel>
                    <ToggleButtonGroup
                      exclusive
                      value={singleplayerHints}
                      onChange={(_, value) => changeSingleplayerHints(value)}
                    >
                      <ToggleButton value={true}>on</ToggleButton>
                      <ToggleButton value={false}>off</ToggleButton>
                    </ToggleButtonGroup>
                  </FormControl>
                </MenuItem>
                <Divider />
                <MenuItem dense disableRipple>
                  <FormControl>
                    <FormLabel>number of lives</FormLabel>
                    <ToggleButtonGroup
                      exclusive
                      value={singleplayerNumLives}
                      onChange={(_, value) => changeSingleplayerNumLives(value)}
                    >
                      <ToggleButton value={3}>three</ToggleButton>
                      <ToggleButton value={6}>six</ToggleButton>
                    </ToggleButtonGroup>
                  </FormControl>
                </MenuItem>
              </Menu>

              <ButtonGroup disabled>
                <Button variant="contained" fullWidth>
                  multiplayer (online)
                </Button>
                <Button variant="contained" size="small">
                  <SettingsIcon fontSize="small" />
                </Button>
              </ButtonGroup>

              <ThemeToggle
                themeState={themeState}
                customChangeThemeState={customChangeThemeState}
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
