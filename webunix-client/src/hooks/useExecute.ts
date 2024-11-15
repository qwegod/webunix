import { clearOutput, printOut } from "../store/reducers/outputSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/reducers/sessionSlice";
import { handleFetchCommands } from "../handlers/handleFetchCommand";
import Cookies from "js-cookie";

function useExecute() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);

  const serverExecute = async (inputValue: string) => {
    switch (inputValue) {
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
    }
  };
  return {
    serverExecute,
  };
}

export default useExecute;
