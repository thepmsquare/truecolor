import React, { FC, useState, StrictMode } from "react";
import type { HeadFC, PageProps } from "gatsby";
import {
  Button,
  Card,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  StyledEngineProvider,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ColorResult, GithubPicker } from "react-color";
import config from "../../config";
import ThemeToggle from "../components/ThemeToggle";
import CustomSnackbar from "../components/CustomSnackbar";
import type CustomSnackbarStateType from "../types/CustomSnackbarStateType";
import type Color from "../types/ColorType";
import "../stylesheets/singleplayer.css";
import "../stylesheets/common.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>truecolor</title>;

const SinglePlayer: FC<PageProps> = () => {
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
  // game states ========
  const [selectedDifficulty, changeSelectedDifficulty] = useState<
    "easy" | "hard"
  >("easy");
  const [allColors, changeAllColors] = useState<Color[]>([]);
  const [correctColor, changeCorrectColor] = useState<Color>({
    id: -1,
    color: "",
  });
  const [selectedColorId, changeSelectedColorId] = useState(-1);
  const [numRounds, changeNumRounds] = useState(10);
  const [currentRound, changeCurrentRound] = useState(0);
  const [score, changeScore] = useState(0);
  const [gameOver, changeGameOver] = useState(false);
  const [start, changeStart] = useState(false);
  const [submited, changeSubmited] = useState(false);
  const [backgroundColor, changeBackgroundColor] = useState("");
  const [feedbackMessage, changeFeedbackMessage] = useState("");
  // ========

  // functions

  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
  };

  const generateHex = () => {
    let hex = "#";
    for (let i = 0; i < 6; i++) {
      hex += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"][
        Math.floor(Math.random() * 16)
      ];
    }
    return hex;
  };

  const updateColors = () => {
    const allColors = [];
    let numColors = selectedDifficulty === "easy" ? 3 : 6;
    // to prevent duplicate colors in same question.
    let i = 0;
    while (i < numColors) {
      let newHex = generateHex();
      if (!allColors.map((ele) => ele.color).includes(newHex)) {
        allColors.push({ id: i, color: generateHex() });
        i++;
      }
    }
    let correctColor = allColors[Math.floor(Math.random() * numColors)];
    changeAllColors(allColors);
    changeCorrectColor(correctColor);
  };

  const handleColorSelect = (colorResult: ColorResult) => {
    let targetColor = allColors.find(
      (ele) => ele.color === colorResult.hex.toUpperCase()
    );

    if (targetColor) {
      changeSelectedColorId(targetColor.id);
    } else {
      throw Error("unexpected error");
    }
  };

  const handleSkip = () => {
    if (currentRound < numRounds) {
      changeSelectedColorId(-1);
      changeSubmited(false);
      changeCurrentRound((oldRound) => oldRound + 1);
      updateColors();
      changeBackgroundColor(correctColor.color);
    } else {
      changeGameOver(true);
      changeStart(false);
    }
  };

  const handleNext = () => {
    if (currentRound < numRounds) {
      changeSelectedColorId(-1);
      changeSubmited(false);
      changeCurrentRound((oldRound) => oldRound + 1);
      updateColors();
    } else {
      changeGameOver(true);
      changeStart(false);
    }
  };

  const handleGameEnd = () => {
    changeSelectedDifficulty("easy");
    changeAllColors([]);
    changeCorrectColor({ id: -1, color: "" });
    changeBackgroundColor("#FFFFFF");
    changeStart(false);
    changeSelectedColorId(-1);
    changeSubmited(false);
    changeNumRounds(10);
    changeCurrentRound(0);
    changeScore(0);
    changeGameOver(false);
  };

  const handleDropdownChange = (e: SelectChangeEvent) => {
    let newValue = e.target.value;
    if (newValue === "easy" || newValue === "hard") {
      changeSelectedDifficulty(newValue);
    } else {
      throw Error("unexpected error.");
    }
  };

  const startGame = () => {
    changeStart(true);
    changeCurrentRound(1);
    updateColors();
  };

  const handleSubmit = () => {
    if (selectedColorId === correctColor.id) {
      changeFeedbackMessage("correct");
      changeSubmited(true);
      changeScore((oldScore) => oldScore + 1);
    } else {
      changeFeedbackMessage("wrong");
      changeSubmited(true);
      changeSelectedColorId(correctColor.id);
    }
    changeBackgroundColor(correctColor.color);
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
          <Card className="main" square>
            <div className="inside-main">
              <div className="Game">
                <Typography variant="h1">Can you guess the color?</Typography>
                <Divider />
                {!start && !gameOver && (
                  <div className="Game-one">
                    <FormControl fullWidth>
                      <InputLabel id="difficulty-select-label">
                        Select difficulty
                      </InputLabel>
                      <Select
                        labelId="difficulty-select-label"
                        value={selectedDifficulty}
                        label="Select difficulty"
                        onChange={handleDropdownChange}
                        disabled={start}
                      >
                        <MenuItem value="easy">Easy</MenuItem>
                        <MenuItem value="hard">Hard</MenuItem>
                      </Select>
                    </FormControl>
                    <Button onClick={startGame}>Start</Button>
                  </div>
                )}
                {start && (
                  <div className="Game-two">
                    <Typography variant="body1">
                      Round {currentRound}/{numRounds}
                    </Typography>
                    <Typography variant="h1">{correctColor.color}</Typography>
                    <GithubPicker
                      color={
                        allColors.find((ele) => ele.id === selectedColorId)
                          ?.color
                      }
                      colors={allColors.map((ele) => ele.color)}
                      width="3"
                      triangle="hide"
                      onChange={handleColorSelect}
                      //  TODO: disabled
                    />

                    {!submited ? (
                      <div className="Game-two-buttonSet">
                        <Button onClick={handleSkip}>Skip</Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={selectedColorId === -1}
                        >
                          Submit
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Typography variant="h4" component="h4">
                          {feedbackMessage}
                        </Typography>
                        <Button onClick={handleNext}>Next</Button>
                      </div>
                    )}
                  </div>
                )}
                {gameOver && (
                  <div className="Game-three">
                    <Typography variant="h2">
                      Your Score is {score}/{numRounds}.
                    </Typography>
                    <Button onClick={handleGameEnd}>Go To Main Screen</Button>
                  </div>
                )}
              </div>
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

export default SinglePlayer;
