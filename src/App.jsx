import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./database";
import { Login } from "./components/login";
import { Chat } from "./components/Chat";
import { Home } from "./components/Home";

function App() {
  const [user, loading] = useAuthState(auth);
  const [userChat, setUserChat] = useState();

  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set({
        email: user.email,
        photoURL: user.photoURL,
      });
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Login />;

  return (
    <div className="text-[#E1E1E6] bg-[#1A1924] min-h-screen">
      {!userChat ? (
        <Home setUserChat={setUserChat} />
      ) : (
        <Chat
          chatId={userChat?.chatId}
          userChat={userChat}
          setUserChat={setUserChat}
        />
      )}
    </div>
  );
}

export default App;
