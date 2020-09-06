import React, { Component } from "react";
import {
  Text,
  Dropdown,
  DefaultButton,
  SwatchColorPicker,
  Separator,
} from "@fluentui/react";
import "./stylesheets/Game.css";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDifficulty: "easy",
      allColors: [],
      correctColor: "",
      start: false,
      selectedColorId: "",
      feedbackMessage: "",
      submited: false,
      numRounds: 10,
      currentRound: 0,
      score: 0,
      gameOver: false,
    };
  }
  handleDropdownChange = (e, { key }) => {
    this.setState(() => {
      return { selectedDifficulty: key };
    });
  };
  generateHex = () => {
    let hex = "#";
    for (let i = 0; i < 6; i++) {
      hex += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"][
        Math.floor(Math.random() * 16)
      ];
    }
    return hex;
  };
  startGame = () => {
    this.setState(() => {
      return { start: true, currentRound: 1 };
    }, this.updateColors);
  };
  updateColors = () => {
    const allColors = [];
    let numColors = this.state.selectedDifficulty === "easy" ? 3 : 6;
    // to prevent duplicate colors in same question.
    let i = 0;
    while (i < numColors) {
      let newHex = this.generateHex();
      if (!allColors.includes(newHex)) {
        allColors.push({ id: i, color: this.generateHex() });
        i++;
      }
    }
    let correctColor = allColors[Math.floor(Math.random() * numColors)];
    this.setState(() => {
      return { allColors, correctColor };
    });
  };
  handleColorSelect = (id) => {
    this.setState(() => {
      return { selectedColorId: id };
    });
  };
  handleSubmit = () => {
    if (this.state.selectedColorId === this.state.correctColor.id) {
      this.setState((curState) => {
        return {
          feedbackMessage: "Correct",
          submited: true,
          score: curState.score + 1,
          selectedColorId: curState.correctColor.id,
        };
      });
    } else {
      this.setState((curState) => {
        return {
          feedbackMessage: "Wrong",
          submited: true,
          selectedColorId: curState.correctColor.id,
        };
      });
    }
    this.props.changeBackground(this.state.correctColor.color);
  };
  handleSkip = () => {
    if (this.state.currentRound < this.state.numRounds) {
      this.setState((curState) => {
        return {
          selectedColorId: "",
          feedbackMessage: "",
          submited: false,
          currentRound: curState.currentRound + 1,
        };
      }, this.updateColors);
      this.props.changeBackground(this.state.correctColor.color);
    } else {
      this.setState(() => {
        return { gameOver: true, start: false };
      });
    }
  };
  handleNext = () => {
    if (this.state.currentRound < this.state.numRounds) {
      this.setState((curState) => {
        return {
          currentRound: curState.currentRound + 1,
          selectedColorId: "",
          feedbackMessage: "",
          submited: false,
        };
      }, this.updateColors);
    } else {
      this.setState(() => {
        return { gameOver: true, start: false };
      });
    }
  };
  handleGameEnd = () => {
    this.setState(
      () => {
        return {
          selectedDifficulty: "easy",
          allColors: [],
          correctColor: "",
          start: false,
          selectedColorId: "",
          feedbackMessage: "",
          submited: false,
          numRounds: 10,
          currentRound: 0,
          score: 0,
          gameOver: false,
        };
      },
      () => {
        this.props.changeBackground("#FFFFFF");
      }
    );
  };
  render = () => {
    const dropdownOptions = [
      { key: "easy", text: "Easy" },
      { key: "hard", text: "Hard" },
    ];
    return (
      <div className="Game">
        <Text variant="xxLarge">Can you guess the color?</Text>
        <Separator />
        {!this.state.start && !this.state.gameOver && (
          <div className="Game-one">
            <Dropdown
              placeholder="Select difficulty"
              options={dropdownOptions}
              selectedKey={this.state.selectedDifficulty}
              onChange={this.handleDropdownChange}
              disabled={this.state.start}
            />
            <DefaultButton text="Start" onClick={this.startGame} />
          </div>
        )}
        {this.state.start && (
          <div className="Game-two">
            <Text variant="mediumPlus">
              Round {this.state.currentRound}/{this.state.numRounds}
            </Text>
            <Text variant="xxLarge">{this.state.correctColor.color}</Text>
            <SwatchColorPicker
              columnCount={3}
              cellShape={"square"}
              colorCells={this.state.allColors}
              selectedId={this.state.selectedColorId}
              isControlled
              onColorChanged={this.handleColorSelect}
              // in pixels :(
              cellWidth={60}
              cellHeight={60}
              disabled={this.state.submited}
            />
            {!this.state.submited ? (
              <div className="Game-two-buttonSet">
                <DefaultButton
                  text="Submit"
                  onClick={this.handleSubmit}
                  disabled={this.state.selectedColorId === ""}
                />
                <DefaultButton text="Skip" onClick={this.handleSkip} />
              </div>
            ) : (
              <div>
                <Text variant="large" as="h4" block>
                  {this.state.feedbackMessage}
                </Text>
                <DefaultButton text="Next" onClick={this.handleNext} />
              </div>
            )}
          </div>
        )}
        {this.state.gameOver && (
          <div className="Game-three">
            <Text variant="xxLarge" as="h2" block>
              Your Score is {this.state.score}/{this.state.numRounds}.
            </Text>
            <DefaultButton
              text="Go To Main Screen"
              onClick={this.handleGameEnd}
            />
          </div>
        )}
      </div>
    );
  };
}
export default Game;
