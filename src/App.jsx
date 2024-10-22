import { useEffect } from "react";
import Chat from "./components/Chat/Chat";
import Detail from "./components/Detail/Detail";
import List from "./components/List/List";
import Login from "./components/Login/Login";
import Notification from "./components/Notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import Loader from "./components/Loader/Loader";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInf } = useUserStore();
  const { chatId } = useChatStore();
  useEffect(() => {
    const onSub = onAuthStateChanged(auth, (user) => {
      fetchUserInf(user?.uid);

      return () => {
        onSub();
      };
    });
  }, [fetchUserInf]);

  if (isLoading)
    return (
      <div className="w-[90vw] h-[90vh] rounded-lg backdrop-blur-md saturate-200 border-2 border-indigo-950/55 border-solid flex justify-center items-center">
        <Loader color={"black"} width={"90"} />
      </div>
    );
  return (
    <div className="w-[90vw] h-[90vh] rounded-lg backdrop-blur-md saturate-200 border-2 border-indigo-950/55 border-solid flex">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
