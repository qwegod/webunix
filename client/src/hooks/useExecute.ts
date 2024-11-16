import {
  clearOutput,
  printOut,
  setWelcome,
} from "../store/reducers/outputSlice";
import { logout } from "../store/reducers/sessionSlice";
import { setResponse } from "../store/reducers/commandsSlice";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import { handleFetchCommands } from "../handlers/handleFetchCommand";

import Cookies from "js-cookie";

import useOutput from "./useOutput";

function useExecute() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);
  const console_commands = useAppSelector(
    (state) => state.output.console_commands
  );
  const { printCommandAndResponse } = useOutput();

  const execute = async (inputValue: string) => {
    switch (inputValue) {
      case "!help":
        const response = Object.entries(console_commands)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        dispatch(setResponse(response));

        break;
      case "!info":
        dispatch(setWelcome());

        break;
      case "!clear":
        dispatch(clearOutput());
        break;
      case "!user":
        dispatch(printOut(JSON.stringify(session)));
        break;
      case "!logout":
        await handleFetchCommands("http://localhost:3232/api/logout", {});
        dispatch(logout());
        Cookies.remove("connect.sid");
        break;
      case "!session":
        const fetchedData = await handleFetchCommands(
          "http://localhost:3232/api/session",
          {}
        );
        dispatch(printOut(JSON.stringify(fetchedData)));
        break;
      default:
        dispatch(setResponse("Unknown command"));

        break;
    }
    printCommandAndResponse();
  };

  return {
    execute,
  };
}

export default useExecute;
