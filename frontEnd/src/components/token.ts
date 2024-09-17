import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

function useGetToken() {
  const token = useSelector((state: RootState) => state.token.token);
  return token;
}

export default useGetToken;
