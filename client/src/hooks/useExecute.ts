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
    const tokens: string[] = inputValue.split(' ')

    switch (tokens[0]) {
      case "help":
        localHelp()

        break;
      case "info":
        localInfo()

        break;
      case "clear":
        localClear()
        break;
      case "user":
        localUser()
        break;
      case "logout":
        await localLogout()

        break;
      case "session":
        await localSession()
        break;
      case "pwd":
        localPwd()
        break
      case "mkdir":
        await localMkdir(tokens[1])
        break
      default:
        dispatch(setResponse("Unknown command"));
        
        break;
    }
    printCommandAndResponse();
  };


  async function localMkdir(inputValue: string) {
    const fetchedData = await handleFetchCommands(
      `${process.env.SERVER_URL}/api/tools/mkdir`, { dirname: inputValue }
    );
    if (fetchedData.success) {
      dispatch(setResponse("Done"));
      return
    }
    dispatch(setResponse("Err"));
  }

  function localHelp() {
    const help_response = Object.entries(console_commands)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  dispatch(setResponse(help_response));
  }

  function localInfo() {
    dispatch(setResponse(message));
  }
  
  function localClear() {
    dispatch(clearOutput());
        dispatch(setResponse("Done"));
  }

  function localUser() {
    let user_response = Object.entries(session)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        dispatch(setResponse(user_response));
  }

 async function localLogout() {
    await handleFetchCommands(`${process.env.SERVER_URL}/api/logout`);
        dispatch(logout());
        setTimeout(() => {
          window.location.reload();
        }, 3000);
  }

 async function localSession() {
    const fetchedData = await handleFetchCommands(
      `${process.env.SERVER_URL}/api/session`
    );
    const session_response = Object.entries(fetchedData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    dispatch(setResponse(session_response));
  }

  function localPwd() {
    dispatch(setResponse(session.directory as string))
  }

  return {
    execute,
  };
}

export default useExecute;
