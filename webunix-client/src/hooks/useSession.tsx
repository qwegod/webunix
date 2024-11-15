import { handleFetchCommands } from "../handlers/handleFetchCommand";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearOutput, printOut, setMessage } from "../store/reducers/outputSlice";
import Cookies from "js-cookie";
import {
    ISession,
  setAuthorized,
  setDirectory,
  setLogin,
  setPassword,
} from "../store/reducers/sessionSlice";

function useSession() {
  
  const dispatch = useAppDispatch();
  const session = useAppSelector(state => state.session)

  const authorizationChecker = async () => {
    
    const clientSessionID = Cookies.get("connect.sid");
    if (clientSessionID && !session.login) {
        
      const fetchedData = await handleFetchCommands(
        "http://localhost:3232/api/authorizationChecker",
        {  }
      );
      if (fetchedData.success) {
        dispatch(setAuthorized());
        dispatch(setLogin(fetchedData.user));
        dispatch(setPassword(true))
        dispatch(setMessage("success"))
        setTimeout(() => {
            dispatch(clearOutput())
        }, 1000)
      } else {
        Cookies.remove("connect.sid");
        dispatch(setMessage("Enter Login"));;
      }
    } else {
      if (session.reg) {
        if (!session.login) {
          dispatch(setMessage("Create Login"))
          return
        }
        else {
        dispatch(setMessage("Create Password"))
        return
        }
       
      }
      if (!session.login) {
        dispatch(setMessage("Enter Login"));
        dispatch(printOut("no account? !reg"));
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

  const notUniqueLoginMessage = () => {
    dispatch(setMessage("Your login is not unique"))
  }
  return {
    authorizationChecker,
    notUniqueLoginMessage,
    directoryMessage,
  };
}

export default useSession;
