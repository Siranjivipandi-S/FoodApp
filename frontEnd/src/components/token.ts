function useGetToken() {
  const token = localStorage.getItem("token");
  // useSelector((state: RootState) => state.token.token);
  return token;
}

export default useGetToken;
