import { clearOutput, printOut } from "../store/reducers/outputSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

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
    }
  };
  return {
    serverExecute,
  };
}

export default useExecute;
