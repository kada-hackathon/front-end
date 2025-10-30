import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = ({ userName = "Gideon A siagian", userDivision = "Nama_Divisi", userAvatar = "/placeholder.svg" }) => {
  const navigate = useNavigate();
  const [filterByFriends, setFilterByFriends] = useState(false);
  const [filterByHashtags, setFilterByHashtags] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search className="navbar-search-icon" />
        <Input
          placeholder="Search"
          className="navbar-search-input"
        />
             <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Filter className="navbar-settings-icon" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Filter Search</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="friends" 
                    checked={filterByFriends}
                    onCheckedChange={(checked) => setFilterByFriends(checked)}
                  />
                  <Label 
                    htmlFor="friends" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Filter by Friends
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hashtags" 
                    checked={filterByHashtags}
                    onCheckedChange={(checked) => setFilterByHashtags(checked)}
                  />
                  <Label 
                    htmlFor="hashtags" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Filter by Hashtags
                  </Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
         <div className="navbar-actions">
        <button onClick={() => navigate('/profile')} className="navbar-user cursor-pointer">
          <Avatar className="navbar-user-avatar">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>GA</AvatarFallback>
          </Avatar>
          <div className="navbar-user-info">
            <p className="navbar-user-name">{userName}</p>
            <p className="navbar-user-division">{userDivision}</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;