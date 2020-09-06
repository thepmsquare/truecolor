import React, { Component } from "react";
import Game from "./Game";
import "./stylesheets/App.css";

class App extends Component {
  changeBackground = (hex) => {
    document.querySelector(".App").style.backgroundColor = hex;
  };
  render = () => {
    return (
      <div className="App">
        <Game changeBackground={this.changeBackground} />
      </div>
    );
  };
}
export default App;
