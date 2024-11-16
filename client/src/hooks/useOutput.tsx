import { useAppDispatch, useAppSelector } from "../store/hooks";

import { printOut } from "../store/reducers/outputSlice";

import store from "../store/store";

function useOutput() {
  const output = useAppSelector((state) => state.output.out);
  

  const dispatch = useAppDispatch()

  const renderLastMessage = () => {

    return output.map((el, index) => <pre key={index}>{el}</pre>);
  };

  const printCommandAndResponse = () => {
    const latestCommand = store.getState().command.value;

    dispatch(printOut(latestCommand.command as string))
    dispatch(printOut(latestCommand.response as string))
  }

  return { renderLastMessage, printCommandAndResponse };
}

export default useOutput;
