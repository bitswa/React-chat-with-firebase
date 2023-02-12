import { auth, provider } from "../database";

export const Login = () => {
  const handleSignIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <div>
      <button onClick={handleSignIn}>Login with Google</button>
    </div>
  );
};
