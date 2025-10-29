import { Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

interface NavbarProps {
  userName?: string;
  userDivision?: string;
  userAvatar?: string;
}

const Navbar = ({ userName = "Gideon A siagian", userDivision = "Nama_Divisi", userAvatar = "/placeholder.svg" }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search className="navbar-search-icon" />
        <Input
          placeholder="Search"
          className="navbar-search-input"
        />
      </div>
      <div className="navbar-actions">
        <Button variant="ghost" size="icon">
          <Settings className="navbar-settings-icon" />
        </Button>
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
