import ChatList from "./ChatList/ChatList";
import UserInfo from "./UserInfo/UserInfo";

const List = () => {
  return (
    <div className="flex-1 w-1/4 flex flex-col">
      <UserInfo />
      <ChatList />
    </div>
  );
};
export default List;
