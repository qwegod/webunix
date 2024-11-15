import { useAppSelector } from "../store/hooks";

function useOutput() {
  const output = useAppSelector((state) => state.output.value);

  const renderLastMessage = () => {
    return output.map((el, index) => <pre key={index}>{el}</pre>);
  };
  return { renderLastMessage };
}

export default useOutput;
