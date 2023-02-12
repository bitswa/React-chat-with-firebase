import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../database";
import firebase from "firebase/compat/app";
import { useCollection } from "react-firebase-hooks/firestore";

import close from "../assets/close.png";
import send from "../assets/send.png";

export const Chat = ({ chatId, setUserChat, userChat }) => {
  const [user] = useAuthState(auth);

  const [message, setMessage] = useState("");
  const refBody = useRef("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message) return;

    db.collection("chats").doc(chatId).collection("messages").add({
      message: message,
      user: user.email,
      photoURL: user.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setMessage("");
  };

  const [messagesRes] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  useEffect(() => {
    if (refBody.current.scrollHeight > refBody.current.offsetHeight) {
      refBody.current.scrollTop =
        refBody.current.scrollHeight - refBody.current.offsetHeight;
    }
  }, [messagesRes]);

  return (
    <div className="min-h-screen py-6 px-8 flex flex-col justify-between">
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={userChat?.photoURL}
            alt="avatar"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col px-4">
            <p className="text-[#E1E1E6] text-base font-bold">
              {userChat?.name}
            </p>
            {/* <span className="flex gap-[4px] items-center text-[#00B37E] text-xs">
              <div className="bg-[#00B37E] w-[10px] h-[10px] rounded-full"></div>
              Online
            </span> */}
          </div>
        </div>
        <button onClick={() => setUserChat(null)}>
          <img src={close} alt="close" className="w-6 h-6" />
        </button>
      </header>

      <main
        ref={refBody}
        className="flex flex-col justify-between h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#282843] px-5"
      >
        {messagesRes?.docs.map((message) =>
          message.data().user != user.email ? (
            <div key={message.id} className="flex flex-col gap-2 mt-8 w-full">
              <span className="text-[#E1E1E6] text-xs">
                {message.data().user.split("@")[0]} -{" "}
                {message.data().timestamp?.toDate()?.toLocaleTimeString()}
              </span>
              <div className="text-[#E1E1E6] text-xs bg-[#633BBC] rounded-xl rounded-tl-none w-[50%] p-4">
                {message.data().message}
              </div>
            </div>
          ) : (
            <div
              key={message.id}
              className="flex flex-col gap-2 mt-8 w-full self-end"
            >
              <span className="text-[#E1E1E6] text-xs text-right">
                Você -{" "}
                {message.data().timestamp?.toDate()?.toLocaleTimeString()}
              </span>
              <div className="text-[#E1E1E6] text-xs bg-[#07847E] rounded-xl rounded-br-none w-[50%] p-4 self-end">
                {message.data().message}
              </div>
            </div>
          )
        )}
      </main>

      <form
        onSubmit={handleSendMessage}
        className="bg-[#282843] rounded-3xl flex justify-between items-center mt-4"
      >
        <label className="w-full h-full px-6" htmlFor="message">
          <input
            type="text"
            name="message"
            placeholder="Digite sua mensagem"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-full bg-transparent outline-none w-full text-xs text-[#E1E1E6] placeholder:text-[#E1E1E6]"
          />
        </label>
        <button type="submit" className="py-3 px-6">
          <img src={send} alt="send" className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};
