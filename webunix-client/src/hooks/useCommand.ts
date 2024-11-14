import { clearCaretOffset } from "../store/reducers/caretOffsetSlice";
import { addCommand, setResponse } from "../store/reducers/commandsSlice";
import { clearInputValue } from "../store/reducers/inputValueSlice";
import { handleFetchCommands } from "../handlers/handleFetchCommand";
import {
  setAuthorized,
  setDirectory,
  setLogin,
  setPassword,
} from "../store/reducers/sessionSlice";
import { clearOutput, printOut } from "../store/reducers/outputSlice";
import useExecute from "./useExecute";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import useSession from "./useSession";
import Cookies from "js-cookie";

function useCommand() {
  const dispatch = useAppDispatch();
  const { directoryMessage } = useSession();
  const { serverExecute } = useExecute();
  const session = useAppSelector((state) => state.session);

  const sendCommand = async (e: KeyboardEvent, inputValue: string) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      if (session.authorized === true) {
        if (inputValue[0] === "!") {
          serverExecute(inputValue);
        } else {
          dispatch(
            addCommand({
              command: inputValue,

              response: null,
            })
          );
          dispatch(printOut(inputValue));
        }
      } else {
        authorization(inputValue);
      }
      dispatch(clearCaretOffset());
      dispatch(clearInputValue());
    }
  };

  const authorization = async (inputValue: string) => {
    if (!session.login) {
      const fetchedData = await handleFetchCommands(
        "http://localhost:3232/api/login",
        {
          login: inputValue,
        }
      );

      if (fetchedData.exists) {
        dispatch(setLogin(inputValue));
        dispatch(clearOutput());
      }
      return;
    }

    if (session.password === false) {
      const fetchedData = await handleFetchCommands(
        "http://localhost:3232/api/password",
        {
          login: session.login,
          password: inputValue,
        }
      );
      if (fetchedData.success) {
        dispatch(clearOutput());
        dispatch(setPassword())
        if (fetchedData.directory) {
          dispatch(setDirectory(fetchedData.directory));
          dispatch(setAuthorized());
          
          dispatch(clearOutput());
        
        } else {
          directoryMessage();
        }
      }
      return;
    }
    if (!session.directory) {
      const fetchedData = await handleFetchCommands(
        "http://localhost:3232/api/directory",
        {
          login: session.login,
          directory: inputValue,
        }
      );
      if (fetchedData.success) {
        dispatch(setDirectory(inputValue));
        dispatch(setAuthorized());
      }
      return;
    }
  };

  return {
    sendCommand,
  };
}

export default useCommand;
