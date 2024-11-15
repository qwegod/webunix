import { Dispatch } from "redux";
import { setCaretOffset } from "../store/reducers/caretOffsetSlice";

export const handleCaretPosition = (
  inputRef: React.RefObject<HTMLInputElement>,
  dispatch: Dispatch
) => {
  requestAnimationFrame(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      const position = inputElement.selectionStart || 0;
      const positionInPixels = position * 9.6;

      dispatch(setCaretOffset(positionInPixels));
    }
  });
};
