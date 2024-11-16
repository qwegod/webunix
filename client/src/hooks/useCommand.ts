import { clearCaretOffset } from "../store/reducers/caretOffsetSlice";
import { setCommand } from "../store/reducers/commandSlice";
import {
  clearInputValue,
  setInputValue,
} from "../store/reducers/inputValueSlice";
import {
  setAuthorized,
  setDirectory,
  setUsername,
  setPassword,
  setRegister,
} from "../store/reducers/sessionSlice";
import {
  clearOutput,
  setMessage,
  setWelcome
} from "../store/reducers/outputSlice";

import { handleFetchCommands } from "../handlers/handleFetchCommand";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import useSession from "./useSession";

function useCommand() {
  const dispatch = useAppDispatch();
  const { authorizationChecker, notUniqueUsernameMessage } = useSession();
  const session = useAppSelector((state) => state.session);
  const suggest = useAppSelector((state) => state.output.suggest);

  const sendCommand = async (e: KeyboardEvent, inputValue: string) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      if (session.authorized === true) {
        if (suggest && inputValue !== suggest) {
          dispatch(setInputValue(suggest));
          return;
        }

        dispatch(
          setCommand({
            command: inputValue,
          })
        );
        dispatch(clearCaretOffset());
        dispatch(clearInputValue());

        return;
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
          `${process.env.SERVER_URL}/api/reg`,
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
          `${process.env.SERVER_URL}/api/reg`,
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
        `${process.env.SERVER_URL}/api/login`,
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
        `${process.env.SERVER_URL}/api/login`,
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
