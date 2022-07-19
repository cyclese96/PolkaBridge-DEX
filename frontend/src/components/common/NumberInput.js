import React from "react";
import { escapeRegExp } from "utils/formatters";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

const NumberInput = ({ onInputChange, value, placeholder, style }) => {
  const onUserTyped = (nextUserInput) => {
    if (nextUserInput === ".") {
      return;
    }
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onInputChange(nextUserInput);
    }
  };

  return (
    <input
      type="text"
      className={style}
      onChange={(event) => onUserTyped(event.target.value.replace(/,/g, "."))}
      value={value}
      placeholder={placeholder ? placeholder : "0.0"}
    />
  );
};

export default React.memo(NumberInput);
