import { auth, provider } from "../database";

export const Login = () => {
  const handleSignIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <div className="min-h-screen text-[#E1E1E6] bg-[#1A1924] grid place-items-center">
      <button
        className="border-2 border-[#282843] shadow-lg p-4 rounded-xl"
        onClick={handleSignIn}
      >
        Login with Google
      </button>
    </div>
  );
};
