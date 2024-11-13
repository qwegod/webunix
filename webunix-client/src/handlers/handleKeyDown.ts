import { Dispatch } from "redux";
import { clearCaretOffset } from "../store/reducers/caretOffsetSlice";
import {
  addCommand,
  clearCommands,
  setResponse,
} from "../store/reducers/commandsSlice";
import { clearInputValue } from "../store/reducers/inputValueSlice";
import { handleFetchCommands } from "./handleFetchCommand";

export const handleKeyDown = async (
  e: KeyboardEvent,
  inputValue: string,
  dispatch: Dispatch
) => {
  if (e.key === "Enter" && inputValue.trim() !== "") {
    dispatch(addCommand(inputValue));
    dispatch(clearCaretOffset());
    dispatch(clearInputValue());
    const fetchedData = await handleFetchCommands(inputValue);
    if (fetchedData.task[0] === "!") {
      if (fetchedData.task === "!clear") dispatch(clearCommands());
    } else {
      dispatch(setResponse(fetchedData.task));
    }
  }
};
