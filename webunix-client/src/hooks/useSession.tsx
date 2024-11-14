import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setMessage } from "../store/reducers/outputSlice";

function useSession() {
    const session = useAppSelector(state => state.session)
    const directory = useAppSelector(state => state.session.directory);
    const dispatch = useAppDispatch()

    const authorizationChecker = () => {
        if (session.authorized === false) {
            if (!session.login) {
                dispatch(setMessage("Enter Login"))
            }
            else if (!session.password) {
                dispatch(setMessage("Enter Password"))
            }
        }
    }

    const directoryChecker = () => {
        if (directory === null) {
            dispatch(setMessage("Name the workspace directory"))
            return false
        }
    }
    return ( 
        {
            authorizationChecker, directoryChecker
        }
     );
}

export default useSession;