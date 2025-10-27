import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Friend {
  id: string;
  name: string;
  division: string;
  avatar: string;
}

interface FriendsListProps {
  friends: Friend[];
}

const FriendsList = ({ friends }: FriendsListProps) => {
  return (
    <aside className="w-72 border-l border-border bg-card p-6 hidden lg:block">
      <h3 className="font-bold text-lg mb-6">Your Friends</h3>
      <div className="space-y-4">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center gap-3 hover:bg-secondary/50 p-2 rounded-lg cursor-pointer transition-colors">
            <Avatar className="w-12 h-12">
              <AvatarImage src={friend.avatar} />
              <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{friend.name}</p>
              <p className="text-xs text-muted-foreground">{friend.division}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default FriendsList;
