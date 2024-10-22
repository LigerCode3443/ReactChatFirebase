import { useUserStore } from "../../../lib/userStore";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  return (
    <div className="p-5 flex justify-between items-center">
      <div className="flex items-center gap-5  ">
        <img
          src={currentUser.avatar || "./avatar.png"}
          alt=""
          className="w-[50px] h-50px rounded-full object-cover"
        />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="flex gap-5">
        <img src="./more.png" alt="" className="w-5 h-5 cursor-pointer" />
        <img src="./video.png" alt="" className="w-5 h-5 cursor-pointer" />
        <img src="./edit.png" alt="" className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
};
export default UserInfo;
