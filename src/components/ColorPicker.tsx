import React from "react";
import "../stylesheets/components/ColorPicker.css";
import { Paper } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import getInverseHexColor from "../utils/getInverseHexColor";
const ColorPicker = (props: {
  color: string | undefined;
  colors: string[];
  width: number;
  onChange: (arg0: string) => void;
}) => {
  return (
    <div
      className="ColorPicker"
      style={{ gridTemplateColumns: `repeat(${props.width}, 1fr)` }}
    >
      {props.colors.map((color) =>
        color === props.color ? (
          <Paper
            style={{
              backgroundColor: color,
              color: getInverseHexColor(color, true),
            }}
            key={color}
            className="Color SelectedColor"
            onClick={() => props.onChange(color)}
            elevation={12}
          >
            <CheckCircleIcon fontSize="large" />
          </Paper>
        ) : (
          <Paper
            variant="outlined"
            style={{ backgroundColor: color }}
            key={color}
            className="Color"
            onClick={() => props.onChange(color)}
          ></Paper>
        )
      )}
    </div>
  );
};
export default ColorPicker;
