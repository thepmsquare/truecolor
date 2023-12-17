import React, { FC, useState, StrictMode, useEffect } from "react";
import { navigate, type HeadFC, type PageProps } from "gatsby";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  StyledEngineProvider,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ColorPicker from "../components/ColorPicker";
import config from "../../config";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { PieChart } from "@mui/x-charts/PieChart";
import { ThemeToggle, CustomSnackbar } from "squarecomponents";
import type { CustomSnackbarStateType } from "squarecomponents";
import type Color from "../types/ColorType";
import "../stylesheets/singleplayer.css";
import "../stylesheets/common.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const isBrowser = typeof window !== "undefined";

export const Head: HeadFC = () => <title>{config.appName}</title>;

const SinglePlayer: FC<PageProps> = (props) => {
  // get stuff from props
  const propsState: any = props.location.state;
  const propsNumColors: number | undefined = propsState?.numColors;
  const propsHints: boolean | undefined = propsState?.hints;
  const propsNumLives: number | undefined = propsState?.numLives;
  if (
    propsHints === undefined ||
    propsNumColors === undefined ||
    propsNumLives === undefined
  ) {
    if (isBrowser) {
      navigate("/");
    }
    return "";
  }

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
  const [numCurrentLives, changeNumCurrentLives] = useState(propsNumLives);
  const [allColors, changeAllColors] = useState<Color[]>([]);
  const [correctColor, changeCorrectColor] = useState<Color>({
    id: -1,
    color: "",
  });
  const [selectedColorId, changeSelectedColorId] = useState(-1);
  const [currentRound, changeCurrentRound] = useState(1);
  const [gameOver, changeGameOver] = useState(false);
  const [submited, changeSubmited] = useState(false);
  const [backgroundColor, changeBackgroundColor] = useState(
    defaultThemeState === "dark" ? "black" : "white"
  );
  const [feedbackMessage, changeFeedbackMessage] = useState("");
  // ========

  // functions

  const customChangeThemeState = (newThemeState: "dark" | "light") => {
    changeThemeState(newThemeState);
    if (isBrowser) {
      window.localStorage.setItem("theme", newThemeState);
    }
    if (currentRound === 1 && !submited) {
      changeBackgroundColor(newThemeState === "dark" ? "black" : "white");
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
    // to prevent duplicate colors in same question.
    let i = 0;
    while (i < propsNumColors) {
      let newHex = generateHex();
      if (!allColors.map((ele) => ele.color).includes(newHex)) {
        allColors.push({ id: i, color: generateHex() });
        i++;
      }
    }
    let correctColor = allColors[Math.floor(Math.random() * propsNumColors)];
    changeAllColors(allColors);
    changeCorrectColor(correctColor);
  };

  const handleColorSelect = (colorResult: string) => {
    let targetColor = allColors.find(
      (ele) => ele.color === colorResult.toUpperCase()
    );
    if (targetColor) {
      changeSelectedColorId(targetColor.id);
    } else {
      throw Error("unexpected error");
    }
  };

  const handleSkip = () => {
    if (numCurrentLives > 1) {
      changeNumCurrentLives((oldLives) => oldLives - 1);
      changeSelectedColorId(-1);
      changeSubmited(false);
      changeCurrentRound((oldRound) => oldRound + 1);
      updateColors();
      changeBackgroundColor(correctColor.color);
    } else {
      changeGameOver(true);
    }
  };

  const handleNext = () => {
    if (numCurrentLives > 0) {
      changeSelectedColorId(-1);
      changeSubmited(false);
      changeCurrentRound((oldRound) => oldRound + 1);
      updateColors();
    } else {
      changeGameOver(true);
    }
  };

  const handleSubmit = () => {
    if (selectedColorId === correctColor.id) {
      changeFeedbackMessage("correct");
      changeSubmited(true);
    } else {
      changeNumCurrentLives((oldLives) => oldLives - 1);
      changeFeedbackMessage("wrong");
      changeSubmited(true);
    }
    changeBackgroundColor(correctColor.color);
  };

  //useEffect
  useEffect(() => {
    // will do once when page is refresh not on consecutive state loads
    updateColors();
  }, []);

  useEffect(() => {
    // will do once when game is over
    if (gameOver) {
      navigate("/");
    }
  }, [gameOver]);

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
          <div className="main" style={{ backgroundColor: backgroundColor }}>
            <Card className="inside-main">
              <CardHeader
                title={`Round ${currentRound}`}
                subheader={
                  <>
                    {[...Array(numCurrentLives).keys()].map((_, idx) => (
                      <FavoriteIcon key={idx} color="error" />
                    ))}
                  </>
                }
              />
              <CardContent className="cardcontent">
                <Typography variant="h2" component="h1">
                  {correctColor.color}
                </Typography>
                {propsHints && correctColor.color && (
                  <div
                    style={{ width: "100%", aspectRatio: 1 }}
                    className="piechart-container"
                  >
                    <PieChart
                      colors={[
                        `#${correctColor.color.slice(1, 3)}0000`,
                        `#00${correctColor.color.slice(3, 5)}00`,
                        `#0000${correctColor.color.slice(5, 7)}`,
                      ]}
                      series={[
                        {
                          data: [
                            {
                              id: 0,
                              value:
                                (parseInt(correctColor.color.slice(1, 3), 16) /
                                  (parseInt(
                                    correctColor.color.slice(1, 3),
                                    16
                                  ) +
                                    parseInt(
                                      correctColor.color.slice(3, 5),
                                      16
                                    ) +
                                    parseInt(
                                      correctColor.color.slice(5, 7),
                                      16
                                    ))) *
                                100,
                              label: "red",
                            },
                            {
                              id: 1,
                              value:
                                (parseInt(correctColor.color.slice(3, 5), 16) /
                                  (parseInt(
                                    correctColor.color.slice(1, 3),
                                    16
                                  ) +
                                    parseInt(
                                      correctColor.color.slice(3, 5),
                                      16
                                    ) +
                                    parseInt(
                                      correctColor.color.slice(5, 7),
                                      16
                                    ))) *
                                100,
                              label: "green",
                            },
                            {
                              id: 2,
                              value:
                                (parseInt(correctColor.color.slice(5, 7), 16) /
                                  (parseInt(
                                    correctColor.color.slice(1, 3),
                                    16
                                  ) +
                                    parseInt(
                                      correctColor.color.slice(3, 5),
                                      16
                                    ) +
                                    parseInt(
                                      correctColor.color.slice(5, 7),
                                      16
                                    ))) *
                                100,
                              label: "blue",
                            },
                          ],

                          cornerRadius: 4,
                          paddingAngle: 4,
                          innerRadius: 30,
                          outerRadius: 100,

                          valueFormatter: (ele) => {
                            let string =
                              ele.label === "red"
                                ? parseInt(correctColor.color.slice(1, 3), 16)
                                : ele.label === "green"
                                ? parseInt(correctColor.color.slice(3, 5), 16)
                                : parseInt(correctColor.color.slice(5, 7), 16);
                            return `${ele.value.toFixed(1)}% | ${string}`;
                          },
                        },
                      ]}
                      slotProps={{ legend: { hidden: true } }}
                    />
                  </div>
                )}
                <Divider />
                <ColorPicker
                  color={
                    allColors.find((ele) => ele.id === selectedColorId)?.color
                  }
                  colors={allColors.map((ele) => ele.color)}
                  width={3}
                  onChange={handleColorSelect}
                />
                {submited && (
                  <Typography variant="h3" component="h2">
                    {feedbackMessage}
                  </Typography>
                )}
                <ThemeToggle
                  themeState={themeState}
                  customChangeThemeState={customChangeThemeState}
                  variant="text"
                />
              </CardContent>
              <CardActions className="cardactions">
                <Button href="/">Back</Button>
                {!submited ? (
                  <>
                    <Button onClick={handleSkip}>Skip</Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={selectedColorId === -1}
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleNext}>Next</Button>
                )}
              </CardActions>
            </Card>
          </div>
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
