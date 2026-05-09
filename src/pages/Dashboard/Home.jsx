import { useAuth } from "../../context/useAuth";

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <h1>
        Welcome back, {user.firstName ? user.firstName.split(" ")[0] : "User"}
      </h1>
    </>
  );
}
