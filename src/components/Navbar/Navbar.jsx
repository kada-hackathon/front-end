import { Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: "Loading...",
    division: "Loading...",
    profilePicture: "/placeholder.svg"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile dari backend
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      setEmployee({
        name: "User",
        division: "Employee",
        profilePicture: "/placeholder.svg"
      });
      return;
    }

    fetch('http://localhost:5000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Profile response:', data);
        if (data && data.user) {
          setEmployee({
            name: data.user.name || "User",
            division: data.user.division || "Employee",
            profilePicture: data.user.profilePicture || "/placeholder.svg"
          });
        } else if (data) {
          setEmployee({
            name: data.name || "User",
            division: data.division || "Employee",
            profilePicture: data.profilePicture || "/placeholder.svg"
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setLoading(false);
        setEmployee({
          name: "User",
          division: "Employee",
          profilePicture: "/placeholder.svg"
        });
      });
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

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
        <div className="navbar-user" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
          <Avatar className="navbar-user-avatar">
            <AvatarImage src={employee.profilePicture} />
            <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="navbar-user-info">
            <p className="navbar-user-name">{employee.name}</p>
            <p className="navbar-user-division">{employee.division}</p>
          </div>
     </div>
      </div>
    </header>
  );
};

export default Navbar;