import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const { currentUser } = useUserStore();
  const [user, setUser] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    const chatsRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");
    try {
      const newChatRef = doc(chatsRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute p-[30px] top-0 bottom-0 right-0 left-0 m-auto w-max h-max bg-gray-950/80 rounded-md">
      <form className="flex gap-5 mb-12" onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="p-5 border-none outline-none rounded-md text-black"
        />
        <button className="px-5 py-[10px] border-none bg-blue-700 text-white rounded-md hover:bg-blue-900">
          Search
        </button>
      </form>
      {user && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src={user.avatar || "./avatar.png"}
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <span>{user.username}</span>
          </div>
          <button
            className="px-[15px] py-[10px] border-none bg-blue-700 text-white rounded-md hover:bg-blue-900"
            onClick={handleAdd}
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
};
export default AddUser;
