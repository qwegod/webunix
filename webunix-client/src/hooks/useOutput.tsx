import { useAppSelector } from "../store/hooks";

function useOutput() {
    const output = useAppSelector(state => state.output.value)

    const renderLastMessage = () => {
        return output.map(el => <div>{el}</div>)
    }
    return ( 
        {renderLastMessage}
     );
}

export default useOutput;