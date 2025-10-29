import { Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ userName = "Gideon A siagian", userDivision = "Nama_Divisi", userAvatar = "/placeholder.svg" }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

<<<<<<< HEAD:src/components/Navbar/Navbar.tsx
const Navbar = ({ userName = "Gideon A siagian", userDivision = "Nama_Divisi", userAvatar = "/placeholder.svg" }: NavbarProps) => {
  const navigate = useNavigate();

=======
>>>>>>> newfrontend:src/components/Navbar/Navbar.jsx
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
<<<<<<< HEAD:src/components/Navbar/Navbar.tsx
        <button onClick={() => navigate('/profile')} className="navbar-user cursor-pointer">
=======
        <div className="navbar-user" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
>>>>>>> newfrontend:src/components/Navbar/Navbar.jsx
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