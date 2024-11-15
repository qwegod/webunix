import { clearCaretOffset } from "../store/reducers/caretOffsetSlice";
import { addCommand, setResponse } from "../store/reducers/commandsSlice";
import { clearInputValue } from "../store/reducers/inputValueSlice";
import { handleFetchCommands } from "../handlers/handleFetchCommand";
import {
  setAuthorized,
  setDirectory,
  setLogin,
  setPassword,
  setRegister,
} from "../store/reducers/sessionSlice";
import { clearOutput, printOut, setMessage } from "../store/reducers/outputSlice";
import useExecute from "./useExecute";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import useSession from "./useSession";
import Cookies from "js-cookie";

function useCommand() {
  const dispatch = useAppDispatch();
  const { authorizationChecker, notUniqueLoginMessage } = useSession();
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
    if (inputValue === "!reg") {
      dispatch(setRegister(true))
      
      return
    }
    if (session.reg) {
      if (!session.login) {
        const fetchedData = await handleFetchCommands(
          "http://localhost:3232/api/reg",
          {
            login: inputValue,
          }
        );
        if (fetchedData.exists === true ) {
          notUniqueLoginMessage()
          setTimeout(() => {authorizationChecker()}, 1500);
        }
        else {
          dispatch(setLogin(inputValue))
          clearOutput()
        }
        return
      }
      else {
        const fetchedData = await handleFetchCommands(
          "http://localhost:3232/api/reg",
          {
            login: session.login,
            password: inputValue
          }
        );
        if (fetchedData.success) {
          dispatch(setPassword(true))
          dispatch(setDirectory(fetchedData.directory))
          dispatch(setRegister(false))
          dispatch(setAuthorized())
          dispatch(clearOutput())
        }
        return
      }
    }

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
        "http://localhost:3232/api/login",
        {
          login: session.login,
          password: inputValue,
        }
      );
      if (fetchedData.success) {
        
        dispatch(setPassword(true))
        
        dispatch(setAuthorized());  
        dispatch(clearOutput());
      
        } 
        
    }
  };

  return {
    sendCommand,
  };
}

export default useCommand;
