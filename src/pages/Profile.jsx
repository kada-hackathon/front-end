import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewUserId = searchParams.get('userId'); // Get userId from URL query params
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  
  // Form data dari database
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    division: "",
    email: "",
    profilePicture: "/placeholder.svg",
    dateOfJoin: ""
  });

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
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log('Photo loaded, base64 length:', base64String.length);
        
        // Update preview and mark as changed
        setProfileData(prev => ({
          ...prev,
          profilePicture: base64String
        }));
        setHasChanges(true);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Error uploading photo');
      setUploading(false);
    }
  };

  // Handle photo delete
  const handlePhotoDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmPhotoDelete = () => {
    // Update preview to placeholder and mark as changed
    setProfileData(prev => ({
      ...prev,
      profilePicture: "/placeholder.svg"
    }));
    setHasChanges(true);
    setShowDeleteDialog(false);
  };

  // Save profile changes to database
  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const confirmSave = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login first');
      setShowSaveDialog(false);
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
        setHasChanges(false); // Reset changes flag
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        console.log('Profile updated successfully');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile');
    } finally {
      setShowSaveDialog(false);
    }
  };

  // Fetch current user ID first
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
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
        const user = data.user || data;
        const userId = user.id || user._id || "";
        setCurrentUserId(userId);
        
        // Determine if viewing own profile
        setIsOwnProfile(!viewUserId || viewUserId === userId);
      })
      .catch(err => {
        console.error('Error fetching current user:', err);
      });
  }, [viewUserId]);

  // Fetch user profile dari backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    // Format date to "Month Day, Year" format
    const formatDateToDisplay = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const month = months[d.getMonth()];
      const day = d.getDate();
      const year = d.getFullYear();
      return `${month} ${day}, ${year}`;
    };

    // If viewing another user's profile, fetch from admin/employees endpoint
    if (viewUserId && currentUserId && viewUserId !== currentUserId) {
      fetch('http://localhost:5000/api/admin/employees', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          const allEmployees = data.data || data.employees || data || [];
          const user = allEmployees.find(emp => emp._id === viewUserId);
          
          if (user) {
            const profilePic = user.profilePicture || user.profile_photo || "/placeholder.svg";
            setProfileData({
              id: user._id || "",
              name: user.name || "",
              division: user.division || "",
              email: user.email || "",
              profilePicture: profilePic,
              dateOfJoin: formatDateToDisplay(user.join_date || user.dateOfJoin)
            });
          }
        })
        .catch(err => {
          console.error('Error fetching user profile:', err);
        });
    } else {
      // Viewing own profile
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

          const profilePic = user.profilePicture || "/placeholder.svg";
          setProfileData({
            id: user.id || user._id || "",
            name: user.name || "",
            division: user.division || "",
            email: user.email || "",
            profilePicture: profilePic,
            dateOfJoin: formatDateToDisplay(user.join_date || user.dateOfJoin)
          });
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
        });
    }
  }, [viewUserId, currentUserId]);

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto bg-background">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-foreground"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-4xl font-bold text-foreground">
                {isOwnProfile ? "Your Profile" : `${profileData.name}'s Profile`}
              </h1>
            </div>

            <div className="max-w-3xl bg-card/50 backdrop-blur-sm rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <label className="text-foreground font-medium min-w-[120px]">Photo:</label>
                <div className="flex items-center gap-8">
                  <Avatar className="w-32 h-32 border border-primary">
                    <AvatarImage src={profileData.profilePicture} />
                    <AvatarFallback>{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {isOwnProfile && (
                    <div className="flex flex-col gap-3">
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
                        disabled={uploading || profileData.profilePicture === "/placeholder.svg"}
                      >
                        Delete Photo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className={isOwnProfile ? "space-y-1" : ""}>
                  {isOwnProfile && (
                    <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                  )}
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Name:</label>
                    <Input 
                      placeholder="Type name"
                      value={profileData.name}
                      readOnly
                      className="flex-1 cursor-default opacity-100 text-foreground bg-background border-input"
                    />
                  </div>
                </div>

                <div className={isOwnProfile ? "space-y-1" : ""}>
                  {isOwnProfile && (
                    <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                  )}
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Division:</label>
                    <Input 
                      placeholder="Division Name"
                      value={profileData.division}
                      readOnly
                      className="flex-1 cursor-default opacity-100 text-foreground bg-background border-input"
                    />
                  </div>
                </div>

                <div className={isOwnProfile ? "space-y-1" : ""}>
                  {isOwnProfile && (
                    <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                  )}
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Email:</label>
                    <Input 
                      placeholder="Type email"
                      type="email"
                      value={profileData.email}
                      readOnly
                      className="flex-1 cursor-default opacity-100 text-foreground bg-background border-input"
                    />
                  </div>
                </div>

                <div className={isOwnProfile ? "space-y-1" : ""}>
                  {isOwnProfile && (
                    <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                  )}
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Date of Join:</label>
                    <Input 
                      placeholder="Date of join"
                      type="text"
                      value={profileData.dateOfJoin}
                      readOnly
                      className="flex-1 cursor-default opacity-100 text-foreground bg-background border-input"
                    />
                  </div>
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex flex-col items-center gap-3 pt-4">
                  <Button onClick={handleSave} className="w-64" disabled={!hasChanges}>
                    SAVE
                  </Button>
                  <div className="h-6 flex items-center justify-center">
                    {showSuccess && (
                      <p className="text-sm text-green-600 font-medium">
                        Your profile has successfully updated!
                      </p>
                    )}
                  </div>
                </div>
              )}
              
            </div>
          </div>

          {/* FriendsList akan auto-fetch data sendiri */}
          <FriendsList />
        </div>
      </main>

      {/* Delete Photo Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Profile Photo?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete your profile photo? This action will replace it with the default avatar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPhotoDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save Profile Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Save your profile?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to save the changes to your profile?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
