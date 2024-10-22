import { useEffect, useState } from "react";
import AddUser from "./AddUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat, chatId } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatRef, { chats: userChats });

      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(input);

  const filterChats = chats.filter((c) =>
    c.user.username.toLowerCase()?.includes(input?.toLowerCase())
  );
  return (
    <div className="flex flex-1 flex-col overflow-scroll">
      <div className="flex items-center gap-5 p-5">
        <div className="flex flex-1 bg-blue-950/55 rounded-md items-center gap-5 p-[10px]">
          <img src="./search.png" alt="" className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none text-white flex-1 "
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        </div>
        <img
          src={addMode ? "./plus.png" : "./minus.png"}
          alt=""
          className="w-[36px] h-[36px] bg-blue-950/55 p-[10px] cursor-pointer rounded-md"
          onClick={() => {
            setAddMode((prev) => !prev);
          }}
        />
      </div>
      {filterChats?.map((chat) => (
        <div
          className="flex items-center gap-5 p-5 cursor-pointer border-b-2 border-solid border-green-950"
          key={chat.chatId}
          onClick={() => {
            handleSelect(chat);
          }}
          style={{
            backgroundColor: chat?.isSeen
              ? "transparent"
              : "rgba(20, 20, 77, 0.691)",
          }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.avatar || "./avatar.png"
            }
            alt=""
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-[10px]">
            <span className="font-medium">
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p className="font-light text-sm">{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};
export default ChatList;
