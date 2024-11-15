import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { handleChangeValue } from "./handlers/handleChangeValue";
import useCommand from "./hooks/useCommand";
import { handleCaretPosition } from "./handlers/handleCaretPosition";
import useOutput from "./hooks/useOutput";
import useSession from "./hooks/useSession";
import { clearSuggest, setSuggest, setSuggestEqual } from "./store/reducers/outputSlice";

function App() {
  const inputValue = useAppSelector((state) => state.inputValue.value);
  const caretOffset = useAppSelector((state) => state.caretOffset.value);
  const { sendCommand } = useCommand();
  const session = useAppSelector((state) => state.session);
  const suggest = useAppSelector(state => state.output.suggest)
  const suggestEqual = useAppSelector(state => state.output.suggestEqual)
  const console_commands = useAppSelector(state => state.output.console_commands)

  const { renderLastMessage } = useOutput();
  const { authorizationChecker } = useSession();

  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchAuthorization() {
      await authorizationChecker();
    }
    fetchAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    const handleKeyDownWrapper = (e: KeyboardEvent) => {
      sendCommand(e, inputValue);
    };

    document.addEventListener("keydown", handleKeyDownWrapper);

    return () => {
      document.removeEventListener("keydown", handleKeyDownWrapper);
    };
  }, [dispatch, inputValue, sendCommand, session]);

  useEffect(() => {
    inputValue
      .split("")
      .forEach((sym, index) =>
        suggest?.split("")[index] === sym ? dispatch(setSuggestEqual(true)) : dispatch(setSuggestEqual(false))
      );
      inputValue === "" 
      ? dispatch(clearSuggest()) 
      : dispatch(setSuggest(Object.keys(console_commands).find((e) => e.startsWith(inputValue)) as string));
    

    console.log(suggest)
  }, [console_commands, dispatch, inputValue, suggest]);

  useEffect(() => {
    const handleCaretPositionWrapper = () => {
      handleCaretPosition(inputRef, dispatch);
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("keydown", handleCaretPositionWrapper);
      inputElement.addEventListener("click", handleCaretPositionWrapper);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keydown", handleCaretPositionWrapper);
        inputElement.removeEventListener("click", handleCaretPositionWrapper);
      }
    };
  }, [dispatch, inputRef]);

  return (
    <div className="flex flex-col w-[70%] h-screen m-auto">
      <div className="h-[90%] border-2 border-yellow-300 p-4">
        {renderLastMessage()}
      </div>
      <div className="h-[10%] border-2 border-red-600 flex items-center justify-center">
        <div className="relative w-[90%] bg-black h-6">
          <span className={"absolute -translate-x-4"}>$</span>
          <span
            className={`
              " absolute text-gray-400  z-0 font-bold",
              ${!suggestEqual && "hidden"}`
            }
          >
            {suggest}
          </span>
          <input
            ref={inputRef}
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              handleChangeValue(e.currentTarget.value, inputRef, dispatch);
            }}
            autoFocus
            value={inputValue}
            type="text"
            className="focus:outline-none bg-transparent absolute z-10 caret-transparent w-full font-black h-full"
            placeholder="!help"
          />

          <div
            style={{ transform: `translateX(${caretOffset}px)` }}
            className={`absolute top-[25%] h-[50%] w-1 `}
          >
            <div
              className={"bg-green-700 w-[9.6px] h-full z-0 animate-caret"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
