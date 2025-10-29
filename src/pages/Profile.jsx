import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";

const Profile = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form data dari database
  const [profileData, setProfileData] = useState({
    name: "",
    division: "",
    email: "",
    profilePicture: "/placeholder.svg",
    dateOfJoin: ""
  });

  const friends = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

  // Update input field
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;
          
          const token = localStorage.getItem('token');
          console.log('Uploading photo, base64 length:', base64String.length);
          
          const res = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              profilePicture: base64String
            })
          });

          const data = await res.json();
          console.log('Upload response:', data);
          
          if (res.ok) {
            setProfileData(prev => ({
              ...prev,
              profilePicture: base64String
            }));
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            console.log('Photo uploaded successfully');
          } else {
            alert(data.message || 'Failed to upload photo');
          }
        } catch (err) {
          console.error('Error in reader:', err);
          alert('Error uploading photo');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Error uploading photo');
      setUploading(false);
    }
  };

  // Handle photo delete
  const handlePhotoDelete = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profilePicture: "/placeholder.svg"
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setProfileData(prev => ({
          ...prev,
          profilePicture: "/placeholder.svg"
        }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        console.log('Photo deleted successfully');
      } else {
        alert(data.message || 'Failed to delete photo');
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Error deleting photo');
    }
  };

  // Save profile changes to database
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      // Only send profilePicture field (yang boleh di-update user)
      const updateData = {
        profilePicture: profileData.profilePicture
      };

      console.log('Sending update:', {
        profilePictureLength: updateData.profilePicture.length,
        isBase64: updateData.profilePicture.startsWith('data:image')
      });

      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();
      
      console.log('Response:', data);
      
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        console.log('Profile updated successfully');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile');
    }
  };

  // Fetch user profile dari backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
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
        console.log('Profile data:', data);
        const user = data.user || data;
        setProfileData({
          name: user.name || "",
          division: user.division || "",
          email: user.email || "",
          profilePicture: user.profilePicture || "/placeholder.svg",
          dateOfJoin: user.dateOfJoin || ""
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        recentProjects={recentProjects}
      />

      <main className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto bg-background">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="text-foreground"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-4xl font-bold text-foreground">Your Profile</h1>
            </div>

            <div className="max-w-3xl bg-card/50 backdrop-blur-sm rounded-2xl p-8 space-y-6">
              <div className="flex items-start gap-8">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-foreground font-medium">Photo:</span>
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileData.profilePicture} />
                    <AvatarFallback>{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col gap-3 pt-6">
                  <div>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <label htmlFor="photo-upload">
                      <Button 
                        variant="default" 
                        className="w-48 cursor-pointer"
                        disabled={uploading}
                        asChild
                      >
                        <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                      </Button>
                    </label>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-48"
                    onClick={handlePhotoDelete}
                    disabled={uploading}
                  >
                    Delete Photo
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Name:</label>
                    <Input 
                      placeholder="Type name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Division:</label>
                    <Input 
                      placeholder="Division Name"
                      value={profileData.division}
                      onChange={(e) => handleInputChange('division', e.target.value)}
                      disabled
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Email:</label>
                    <Input 
                      placeholder="Type email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-foreground font-medium min-w-[120px]">Date of Join:</label>
                  <Input 
                    placeholder="Date of join"
                    type="date"
                    value={profileData.dateOfJoin}
                    onChange={(e) => handleInputChange('dateOfJoin', e.target.value)}
                    disabled
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
              </div>

              <div className="flex flex-col items-center gap-3 pt-4">
                <Button onClick={handleSave} className="w-64">
                  SAVE
                </Button>
                {showSuccess && (
                  <p className="text-sm text-green-600 font-medium">
                    Your profile has successfully updated!
                  </p>
                )}
              </div>
            </div>
          </div>

          <FriendsList friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default Profile;
