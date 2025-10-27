import { Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  userName?: string;
  userDivision?: string;
  userAvatar?: string;
}

const Navbar = ({ userName = "Gideon A siagian", userDivision = "Nama_Divisi", userAvatar = "/placeholder.svg" }: NavbarProps) => {
  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="border-0 bg-secondary/50 focus-visible:ring-1"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>GA</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-muted-foreground">{userDivision}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
