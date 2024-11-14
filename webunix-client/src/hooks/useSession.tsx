import { handleFetchCommands } from "../handlers/handleFetchCommand";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearOutput, setMessage } from "../store/reducers/outputSlice";
import Cookies from "js-cookie";
import {
    ISession,
  setAuthorized,
  setDirectory,
  setLogin,
} from "../store/reducers/sessionSlice";

function useSession() {
  
  const dispatch = useAppDispatch();
  const session = useAppSelector(state => state.session)

  const authorizationChecker = async () => {
    
    const clientSessionID = Cookies.get("session_id");
    if (clientSessionID) {
        
      const fetchedData = await handleFetchCommands(
        "http://localhost:3232/api/authorizationChecker",
        { clientID: clientSessionID }
      );
      if (fetchedData.success) {
        dispatch(setAuthorized());
        dispatch(setLogin(fetchedData.login));
        dispatch(setDirectory(fetchedData.directory));
        dispatch(setMessage("success"))
        setTimeout(() => {
            dispatch(clearOutput())
        }, 1000)
      } else {
        Cookies.remove("session_id");
        dispatch(setMessage("Enter Login"));;
      }
    } else {
      if (!session.login) {
        dispatch(setMessage("Enter Login"));
        return;
      }
      dispatch(setMessage("Enter Password"));
    }
  };

  const directoryMessage = () => {
    dispatch(setMessage("Name the workspace directory"));
  };
  return {
    authorizationChecker,
    directoryMessage,
  };
}

export default useSession;
