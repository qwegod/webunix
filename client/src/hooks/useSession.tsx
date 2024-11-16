import { handleFetchCommands } from "../handlers/handleFetchCommand";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  setLogin,
  setMessage,
  setWelcome,
} from "../store/reducers/outputSlice";
import {
  setAuthorized,
  setUsername,
  setPassword,
} from "../store/reducers/sessionSlice";

import Cookies from "js-cookie";

function useSession() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);

  const authorizationChecker = async () => {
    const clientSessionID = Cookies.get("connect.sid");
    if (clientSessionID && !session.username) {
      const fetchedData = await handleFetchCommands(
        "http://localhost:3232/api/authorizationChecker"
      );
      if (fetchedData.success) {
        dispatch(setAuthorized());
        dispatch(setUsername(fetchedData.user));
        dispatch(setPassword(true));
        dispatch(setMessage("success"));
        setTimeout(() => {
          dispatch(setWelcome());
        }, 1000);
      } else {
        Cookies.remove("connect.sid");
        setTimeout(() => {
          window.location.reload()
        }, 1000);
        return;
      }
    } else {
      if (session.reg) {
        if (!session.username) {
          dispatch(setMessage("Create Username"));
          return;
        } else {
          dispatch(setMessage("Create Password"));
          return;
        }
      }
      if (!session.username) {
        dispatch(setLogin());
        return;
      }
      if (!session.password) {
        dispatch(setMessage("Enter Password"));
      }
    }
  };

  const directoryMessage = () => {
    dispatch(setMessage("Name the workspace directory"));
  };

  const notUniqueUsernameMessage = () => {
    dispatch(setMessage("Your Username is not unique"));
  };
  return {
    authorizationChecker,
    notUniqueUsernameMessage,
    directoryMessage,
  };
}

export default useSession;
