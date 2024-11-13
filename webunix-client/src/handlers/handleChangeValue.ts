import { Dispatch } from "redux";
import { setInputValue } from "../store/reducers/inputValueSlice";
import { clearCaretOffset } from "../store/reducers/caretOffsetSlice";

export const handleChangeValue = (
  value: string,
  inputRef: React.RefObject<HTMLInputElement>,
  dispatch: Dispatch
) => {
  const inputElement = inputRef.current;
  if (!(inputElement && value.length * 9.6 >= inputElement.clientWidth - 30))
    dispatch(setInputValue(value));

  if (value.length === 0) dispatch(clearCaretOffset());
};
