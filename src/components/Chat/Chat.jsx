import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { upload } from "../../lib/upload";
import { format } from "timeago.js";

const Chat = () => {
  const endRef = useRef();
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState();
  const [text, setText] = useState("");
  const [own, setOwn] = useState(true);
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const { chatId, user, isCurrentUserBlocked, isReceivedBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });
      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, { chats: userChatsData.chats });
        }
      });
    } catch (error) {
      console.log(error);
    }
    setImg({
      file: null,
      url: "",
    });
    setText("");
  };

  return (
    <div className="flex-2 w-2/4 border-l-2 border-r-2 border-solid border-green-950 h-full flex flex-col">
      <div className="flex items-center justify-between p-[10px] border-b-2 border-solid border-green-950">
        <div className="flex items-center gap-5 ">
          <img
            src={user?.avatar || "./avatar.png"}
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex  gap-[5px] flex-col">
            <span className="text-lg font-bold">{user?.username}</span>
            <p className="text-sm font-light text-black">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <img src="./phone.png" alt="" className="w-5 h-5" />
          <img src="./video.png" alt="" className="w-5 h-5" />
          <img src="./info.png" alt="" className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 p-5 overflow-scroll flex flex-col gap-5">
        {chat?.messages?.map((message) => (
          <div
            className={`flex gap-3 max-w-[70%] items-center ${
              message.senderId === currentUser?.id ? "self-end" : "self-start"
            }`}
            key={message.createdAt}
          >
            {message.senderId !== currentUser?.id && (
              <img
                src={user?.avatar || "./avatar.png"}
                alt=""
                className="w-[40px] h-[40px] object-cover rounded-full"
              />
            )}
            <div className="flex-1 flex flex-col gap-2">
              {message?.img && (
                <img
                  src={message?.img}
                  alt=""
                  className="w-full h-[300px] object-cover rounded-sm"
                />
              )}
              <p
                className={` rounded-lg p-5 text-base ${
                  message?.senderId === currentUser?.id
                    ? "bg-blue-600/55"
                    : "bg-gray-400/55"
                }`}
              >
                {message?.text}
              </p>
              <span className="text-sm opacity-55">
                {format(message.createdAt.toDate())}
              </span>
            </div>
          </div>
        ))}
        {img.url && (
          <div
            className={`flex gap-5 w-[70%] ${own ? "self-end" : "self-start"}`}
          >
            <div className="flex-1 flex flex-col gap-2">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="flex justify-between items-center gap-5 p-5 border-t-2 border-solid border-green-950 mt-auto">
        <div className="flex gap-5">
          <label htmlFor="file">
            <img src="./img.png" alt="" className="w-5 h-5 cursor-pointer" />
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleImg}
          />
          <img src="./video.png" alt="" className="w-5 h-5 cursor-pointer" />
          <img src="./mic.png" alt="" className="w-5 h-5 cursor-pointer" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceivedBlocked
              ? "You cannot send message"
              : "Type a message."
          }
          className="flex-1 bg-blue-950/55 border-none outline-none text-white rounded-[10px] p-5 text-base disabled:cursor-not-allowed"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          disabled={isCurrentUserBlocked || isReceivedBlocked}
        />
        <div className="relative">
          <img
            src="./emoji.png"
            alt=""
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          />
          <div className="absolute bottom-[50px] left-0">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} theme="dark" />
          </div>
        </div>
        <button
          className="px-5 py-[10px] border-none bg-blue-700 text-white rounded-md hover:bg-blue-900 disabled:bg-blue-700/50 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceivedBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;
