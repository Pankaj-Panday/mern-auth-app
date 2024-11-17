export default function useAuth() {
  const token = JSON.parse(localStorage.getItem("token"));
  const isLoggedIn = token !== null;
  return isLoggedIn;
}
