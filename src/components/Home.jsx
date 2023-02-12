import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../database";

export const Home = ({ setUserChat }) => {
  const [user] = useAuthState(auth);

  return (
    <div className="py-6 px-8 flex flex-col items-center">
      <Header user={user} />
      <Sidebar user={user} setUserChat={setUserChat} />
    </div>
  );
};

const Sidebar = ({ user, setUserChat }) => {
  const refChat = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatsSnapshot] = useCollection(refChat);

  return (
    <div className="min-h-[60vh] w-[300px] p-2 scrollbar-thin overflow-y-auto">
      {chatsSnapshot?.docs.map((item, index) => (
        <ChatsItem
          key={index}
          id={item.id}
          users={item?.data().users}
          user={user}
          setUserChat={setUserChat}
        />
      ))}
    </div>
  );
};

const Header = ({ user }) => {
  const handleCreateChat = () => {
    const emailInput = prompt("Email:");

    if (!emailInput) return;

    if (emailInput == user.email) return;

    db.collection("chats").add({
      users: [user.email, emailInput],
    });
  };

  return (
    <header className="flex flex-col items-center justify-between gap-4 mb-4">
      <div className="flex flex-col items-center gap-2">
        <img
          className="rounded-full w-12 h-12"
          src={user?.photoURL}
          alt="avatar"
        />
        <p>{user?.email}</p>
      </div>
      <button
        className="border-2 border-[#282843] shadow-lg w-24 py-2 rounded-xl "
        onClick={handleCreateChat}
      >
        add
      </button>
    </header>
  );
};

const ChatsItem = ({ id, users, user, setUserChat }) => {
  const getUser = (users, userLogged) =>
    users?.filter((user) => user !== userLogged?.email)[0];

  const [getUserItem] = useCollection(
    db.collection("users").where("email", "==", getUser(users, user))
  );

  const Avatar = getUserItem?.docs?.[0]?.data();
  const item = getUser(users, user);

  const handleNewChat = () => {
    const userChat = {
      chatId: id,
      name: item.split("@")[0],
      photoURL: Avatar?.photoURL,
    };

    setUserChat(userChat);
  };

  return (
    <button
      className="flex items-center p-4 w-full rounded-xl border-2 shadow-lg border-[#282843]"
      onClick={handleNewChat}
    >
      <img
        className="rounded-full w-12 h-12"
        src={Avatar?.photoURL}
        alt="avatar"
      />
      <p className="px-4">{item.split("@")[0]}</p>
    </button>
  );
};
