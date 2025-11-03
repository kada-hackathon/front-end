import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendsList.css";
import { AUTH_ENDPOINTS, ADMIN_ENDPOINTS } from "../../config/api";

const FriendsList = ({ userDivision, userId, autoFetch = true }) => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState({ division: "", id: "" });

  const handleFriendClick = (friendId) => {
    navigate(`/profile?userId=${friendId}`);
  };

  // Jika tidak ada props, auto fetch dari current user
  useEffect(() => {
    if (!autoFetch || (userDivision && userId)) {
      return; // Skip jika ada props atau autoFetch disabled
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch current user profile
    fetch(AUTH_ENDPOINTS.PROFILE, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const user = data.user || data;
        setCurrentUserData({
          division: user.division || "",
          id: user.id || user._id || ""
        });
      })
      .catch(err => console.error('Error fetching current user:', err));
  }, [autoFetch, userDivision, userId]);

  // Fetch friends
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Gunakan props atau data yang di-fetch
    const division = userDivision || currentUserData.division;
    const id = userId || currentUserData.id;

    console.log('FriendsList mount - userDivision:', division, 'userId:', id, 'token:', token ? 'exists' : 'null');
    
    if (!token || !division || !id) {
      console.log('FriendsList: missing required data');
      setLoading(false);
      return;
    }

    // Fetch all employees
    fetch(ADMIN_ENDPOINTS.EMPLOYEES, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        console.log('FriendsList: fetch response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('FriendsList: All employees response:', data);
        
        // Extract employees from response - bisa dari data atau employees field
        const allEmployees = data.data || data.employees || data || [];
        
        // Ensure it's an array
        if (!Array.isArray(allEmployees)) {
          console.error('FriendsList: Response is not an array:', allEmployees);
          setLoading(false);
          return;
        }

        console.log('FriendsList: allEmployees count:', allEmployees.length);

        // Filter employees dengan division sama dan exclude current user
        const filteredFriends = allEmployees.filter(emp => 
          emp.division === division && emp._id !== id
        );


        // Map ke format yang sesuai dengan FriendsList
        const formattedFriends = filteredFriends.map(emp => ({
          id: emp._id,
          name: emp.name,
          division: emp.division,
          avatar: emp.profile_photo || '/placeholder.svg'
        }));

        //console.log('FriendsList: Formatted friends:', formattedFriends);
        setFriends(formattedFriends);
        setLoading(false);
      })
      .catch(err => {
        console.error('FriendsList: Error fetching employees:', err);
        setLoading(false);
      });
  }, [userDivision, userId, currentUserData]);

  return (
    <aside className="friends-list">
      <h3 className="friends-list-title">Your Friends</h3>
      <div className="friends-list-container">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : friends.length === 0 ? (
          <p className="text-sm text-muted-foreground">No friends in your division</p>
        ) : (
          friends.map((friend) => (
            <div 
              key={friend.id} 
              className="friend-item"
              onClick={() => handleFriendClick(friend.id)}
              style={{ cursor: 'pointer' }}
            >
              <Avatar className="friend-avatar">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="friend-name">{friend.name}</p>
                <p className="friend-division">{friend.division}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default FriendsList;