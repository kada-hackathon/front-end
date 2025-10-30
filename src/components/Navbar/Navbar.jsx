import { Search, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  const [filterByFriends, setFilterByFriends] = useState(false);
  const [filterByHashtags, setFilterByHashtags] = useState(false);

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
        <Button variant="ghost" size="icon">
          <Settings className="navbar-settings-icon" />
        </Button>
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