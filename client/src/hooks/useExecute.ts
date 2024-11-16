import { clearOutput } from "../store/reducers/outputSlice";
import { logout } from "../store/reducers/sessionSlice";
import { setResponse } from "../store/reducers/commandSlice";

import { message } from "../welcome";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import { handleFetchCommands } from "../handlers/handleFetchCommand";


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
      case "help":
        const help_response = Object.entries(console_commands)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        dispatch(setResponse(help_response));

        break;
      case "info":
        dispatch(setResponse(message));

        break;
      case "clear":
        dispatch(clearOutput());
        dispatch(setResponse("Done"));
        break;
      case "user":
        let user_response = Object.entries(session)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        dispatch(setResponse(user_response));
        break;
      case "logout":
        await handleFetchCommands("http://localhost:3232/api/logout", {});
        dispatch(logout());
        setTimeout(() => {
          window.location.reload();
        }, 3000);

        break;
      case "session":
        const fetchedData = await handleFetchCommands(
          "http://localhost:3232/api/session",
          {}
        );
        const session_response = Object.entries(fetchedData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        dispatch(setResponse(session_response));
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
