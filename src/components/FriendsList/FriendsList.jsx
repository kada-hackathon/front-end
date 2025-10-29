import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./FriendsList.css";

const FriendsList = ({ friends }) => {
  return (
    <aside className="friends-list">
      <h3 className="friends-list-title">Your Friends</h3>
      <div className="friends-list-container">
        {friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <Avatar className="friend-avatar">
              <AvatarImage src={friend.avatar} />
              <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="friend-name">{friend.name}</p>
              <p className="friend-division">{friend.division}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FriendsList;