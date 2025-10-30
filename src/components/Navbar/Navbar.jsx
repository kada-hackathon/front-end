import { Search, Settings, LogOut, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "@/utils/authUtils";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: "Loading...",
    division: "Loading...",
    profilePicture: "/placeholder.svg"
  });
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterByFriends, setFilterByFriends] = useState(false);
  const [filterByHashtags, setFilterByHashtags] = useState(false);

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

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search className="navbar-search-icon" />
        <Input
          placeholder="Search"
          className="navbar-search-input"
        />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowFilter(!showFilter)}
          className={showFilter ? "text-primary" : ""}
        >
          <Filter className="navbar-settings-icon" />
        </Button>
      </div>

      {/* Filter dropdown */}
      {showFilter && (
        <div className="absolute top-16 right-64 bg-card border rounded-lg p-4 shadow-lg z-50 w-56">
          <h4 className="font-semibold text-sm mb-3">Filter Search</h4>
          <div className="space-y-2">
            <button 
              onClick={() => setFilterByFriends(!filterByFriends)}
              className={`w-full text-left p-2 rounded ${filterByFriends ? 'bg-primary/20 text-primary' : 'hover:bg-muted'}`}
            >
              {filterByFriends ? '✓' : '○'} Filter by Friends
            </button>
            <button 
              onClick={() => setFilterByHashtags(!filterByHashtags)}
              className={`w-full text-left p-2 rounded ${filterByHashtags ? 'bg-primary/20 text-primary' : 'hover:bg-muted'}`}
            >
              {filterByHashtags ? '✓' : '○'} Filter by Hashtags
            </button>
          </div>
        </div>
      )}
        <div className="navbar-actions">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="navbar-settings-icon" />
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