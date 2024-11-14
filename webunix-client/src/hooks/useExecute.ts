import { clearOutput, printOut } from "../store/reducers/outputSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/reducers/sessionSlice";

function useExecute() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);

  const serverExecute = (inputValue: string) => {
    switch (inputValue) {
      case "!clear":
        dispatch(clearOutput());
        break;
      case "!user":
        dispatch(printOut(JSON.stringify(session)));
        break;
      case "!logout":
        dispatch(logout())
    }
  };
  return {
    serverExecute,
  };
}

export default useExecute;
