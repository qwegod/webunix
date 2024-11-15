import { clearCaretOffset } from "../store/reducers/caretOffsetSlice";
import { addCommand } from "../store/reducers/commandsSlice";
import { clearInputValue } from "../store/reducers/inputValueSlice";
import { handleFetchCommands } from "../handlers/handleFetchCommand";
import {
  setAuthorized,
  setDirectory,
  setUsername,
  setPassword,
  setRegister,
} from "../store/reducers/sessionSlice";
import {
  clearOutput,
  printOut,
  setMessage,
  setWelcome,
} from "../store/reducers/outputSlice";
import useExecute from "./useExecute";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import useSession from "./useSession";

function useCommand() {
  const dispatch = useAppDispatch();
  const { authorizationChecker, notUniqueUsernameMessage } = useSession();
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
      dispatch(setRegister(true));

      return;
    }
    if (session.reg) {
      if (!session.username) {
        const fetchedData = await handleFetchCommands(
          "http://localhost:3232/api/reg",
          {
            username: inputValue,
          }
        );
        if (fetchedData.exists === true) {
          notUniqueUsernameMessage();
          setTimeout(() => {
            authorizationChecker();
          }, 1500);
        } else {
          dispatch(setUsername(inputValue));
          clearOutput();
        }
        return;
      } else {
        const fetchedData = await handleFetchCommands(
          "http://localhost:3232/api/reg",
          {
            username: session.username,
            password: inputValue,
          }
        );
        if (fetchedData.success) {
          dispatch(setPassword(true));
          dispatch(setDirectory(fetchedData.directory));
          dispatch(setRegister(false));
          dispatch(setAuthorized());
          dispatch(setMessage("success"));
          setTimeout(() => {
            dispatch(setWelcome());
          }, 1000);
        }
        return;
      }
    }

    if (!session.username) {
      const fetchedData = await handleFetchCommands(
        "http://localhost:3232/api/login",
        {
          username: inputValue,
        }
      );

      if (fetchedData.exists) {
        dispatch(setUsername(inputValue));
        dispatch(clearOutput());
      }
      return;
    }

    if (session.password === false) {
      const fetchedData = await handleFetchCommands(
        "http://localhost:3232/api/login",
        {
          username: session.username,
          password: inputValue,
        }
      );
      if (fetchedData.success) {
        dispatch(setPassword(true));
        dispatch(setAuthorized());
        dispatch(setMessage("success"));
        setTimeout(() => {
          dispatch(setWelcome());
        }, 1000);
      }
    }
  };

  return {
    sendCommand,
  };
}

export default useCommand;
