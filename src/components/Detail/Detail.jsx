import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";

const Detail = () => {
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceivedBlocked, changeBlock } =
    useChatStore();

  const handleBlock = async () => {
    if (!user) return;

    const useDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(useDocRef, {
        blocked: isReceivedBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex-1 w-1/4 flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center gap-3 py-[30px] px-5 border-b-2 border-solid border-green-950">
          <img
            src={user?.avatar || "./avatar.png"}
            alt=""
            className="w-[100px] h-[100px] rounded-full object-cover"
          />

          <h2 className="text-xl">{user?.username}</h2>
          <p className="text-base">Lorem ipsum dolor sit amet .</p>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <div>
            <div className="flex items-center justify-between">
              <span>Chat settings</span>
              <img
                src="./arrowUp.png"
                alt=""
                className="w-[30px] h-[30px] rounded-full cursor-pointer p-[10px] bg-blue-950/55"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span>Privacy % help</span>
              <img
                src="./arrowUp.png"
                alt=""
                className="w-[30px] h-[30px] rounded-full cursor-pointer p-[10px] bg-blue-950/55"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span>Shared photos</span>
              <img
                src="./arrowDown.png"
                alt=""
                className="w-[30px] h-[30px] rounded-full cursor-pointer p-[10px] bg-blue-950/55"
              />
            </div>
            <div className="flex flex-col gap-4 mt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <img
                    src="https://st4.depositphotos.com/20363444/37923/i/450/depositphotos_379230368-stock-photo-aerial-view-carmelite-church-houses.jpg"
                    alt=""
                    className="w-10 h-10 rounded-sm object-cover"
                  />
                  <span className="text-sm opacity-55">photo_2024_2.png</span>
                </div>
                <img
                  src="./download.png"
                  alt=""
                  className="w-[30px] h-[30px] rounded-full cursor-pointer p-[10px] bg-blue-950/55"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <img
                    src="https://st4.depositphotos.com/20363444/37923/i/450/depositphotos_379230368-stock-photo-aerial-view-carmelite-church-houses.jpg"
                    alt=""
                    className="w-10 h-10 rounded-sm object-cover"
                  />
                  <span className="text-sm opacity-55">photo_2024_2.png</span>
                </div>
                <img
                  src="./download.png"
                  alt=""
                  className="w-[30px] h-[30px] rounded-full cursor-pointer p-[10px] bg-blue-950/55"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <img
                    src="https://st4.depositphotos.com/20363444/37923/i/450/depositphotos_379230368-stock-photo-aerial-view-carmelite-church-houses.jpg"
                    alt=""
                    className="w-10 h-10 rounded-sm object-cover"
                  />
                  <span className="text-sm opacity-55">photo_2024_2.png</span>
                </div>
                <img
                  src="./download.png"
                  alt=""
                  className="w-[30px] h-[30px] rounded-full cursor-pointer p-[10px] bg-blue-950/55"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <img
                    src="https://st4.depositphotos.com/20363444/37923/i/450/depositphotos_379230368-stock-photo-aerial-view-carmelite-church-houses.jpg"
                    alt=""
                    className="w-10 h-10 rounded-sm object-cover"
                  />
                  <span className="text-sm opacity-55">photo_2024_2.png</span>
                </div>
                <img
                  src="./download.png"
                  alt=""
                  className="w-[30px] h-[30px] rounded-full cursor-pointer p-[10px] bg-blue-950/55"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span>Shared Files</span>
              <img
                src="./arrowUp.png"
                alt=""
                className="w-[30px] h-[30px] rounded-full cursor-pointer p-[10px] bg-blue-950/55"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-5 ">
        <button
          className="p-[10px] text-white bg-red-950/85 border-none rounded-md hover:bg-red-900"
          onClick={handleBlock}
        >
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceivedBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button
          className="p-[10px] border-none bg-blue-700 text-white rounded-md hover:bg-blue-900"
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default Detail;
