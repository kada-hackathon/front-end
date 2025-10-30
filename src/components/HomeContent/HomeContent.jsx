import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomeContent.css";

const HomeContent = ({ filters = { searchQuery: "", selectedTags: [], dateRange: { start: "", end: "" } } }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [userDivision, setUserDivision] = useState("");
  const [searchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');  // ← Extract ?tag=AI

  // Fetch user profile untuk greeting + divisi
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        const userData = data.user || data;
        setUserName(userData.name || "User");
        setUserDivision(userData.division || "");
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch worklogs dari backend dan convert ke posts format
  useEffect(() => {
    const fetchWorklogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/worklogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Worklogs response:', data);
        console.log('Current filters:', filters); // DEBUG
        
        // Convert worklogs ke format posts
        let worklogsArray = data.worklogs || data || [];
        
        // Filter by same division as current user
        if (userDivision) {
          worklogsArray = worklogsArray.filter(worklog =>
            worklog.user?.division === userDivision
          );
        }
        
        // Filter berdasarkan selectedTag dari URL (hashtag click)
        if (selectedTag) {
          worklogsArray = worklogsArray.filter(worklog => 
            worklog.tag && worklog.tag.includes(selectedTag)
          );
        }
        
        // Filter by search query (title, content, or user name)
        if (filters?.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          worklogsArray = worklogsArray.filter(worklog =>
            worklog.title?.toLowerCase().includes(query) ||
            worklog.content?.toLowerCase().includes(query) ||
            worklog.user?.name?.toLowerCase().includes(query)
          );
          console.log('After search filter:', worklogsArray.length); // DEBUG
        }
        
        // Filter by selected tags (checklist - OR logic)
        if (filters?.selectedTags?.length > 0) {
          worklogsArray = worklogsArray.filter(worklog =>
            worklog.tag && filters.selectedTags.some(tag => worklog.tag.includes(tag))
          );
          console.log('After tag filter:', worklogsArray.length); // DEBUG
        }
        
        // Filter by date range
        if (filters?.dateRange?.start || filters?.dateRange?.end) {
          worklogsArray = worklogsArray.filter(worklog => {
            const worklogDate = new Date(worklog.datetime || worklog.createdAt);
            if (filters.dateRange.start) {
              const startDate = new Date(filters.dateRange.start);
              if (worklogDate < startDate) return false;
            }
            if (filters.dateRange.end) {
              const endDate = new Date(filters.dateRange.end);
              endDate.setHours(23, 59, 59, 999);
              if (worklogDate > endDate) return false;
            }
            return true;
          });
          console.log('After date filter:', worklogsArray.length); // DEBUG
        }
        
        const convertedPosts = worklogsArray.map((worklog) => ({
          id: worklog._id || worklog.id,
          author: {
            name: worklog.user?.name || "User",
            division: worklog.user?.division || "Unknown Division",
            avatar: worklog.user?.profilePicture || worklog.user?.profile_photo || "/placeholder.svg",
          },
          date: new Date(worklog.datetime || worklog.createdAt).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          title: worklog.title || "Work Log",
          hashtags: worklog.tag || [],
          content: worklog.content || "",
          image: worklog.media?.[0] || null,
        }));
        
        setPosts(convertedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching worklogs:', err);
        setLoading(false);
      }
    };
    fetchWorklogs();
  }, [selectedTag, userDivision, filters]);

  // detail post => navigate ke halaman blog-post
  const handlePostClick = (postId) => {
    navigate(`/blog-post?id=${postId}`);
  };

  return (
    <div className="home-content">
      <h1 className="home-greeting">Hello, {userName}</h1>

      {selectedTag && (
        <div className="mb-4 p-3 bg-purple-100 rounded">
          <span>Filtering by tag: </span>
          <strong>#{selectedTag} </strong>
          <button onClick={() => navigate('/')}> Clear Filter</button>
        </div>
      )}
      {loading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">No work logs yet</div>
      ) : (
        <div className="posts-container">
          {posts.map((post) => (
            <article key={post.id} className="post-card" onClick={() => handlePostClick(post.id)} style={{ cursor: "pointer" }}>
              <div className="post-header">
                <div className="post-author">
                  <Avatar className="post-avatar">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="post-author-name">{post.author.name}</p>
                    <p className="post-author-division">{post.author.division}</p>
                  </div>
                </div>
                <span className="post-date">{post.date}</span>
              </div>

              <h2 className="post-title">{post.title}</h2>

              {post.hashtags.length > 0 && (
                <p className="post-hashtags">
                  {post.hashtags.map((tag) => (
                    <span 
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/?tag=${tag}`);
                      }}
                      style={{ cursor: "pointer", color: "blue", marginRight: "8px" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </p>
              )}

              {post.content && <p className="post-content">{post.content}</p>}

              {post.image && (
                <div className="post-image-container">
                  <img src={post.image} alt={post.title} className="post-image" />
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeContent;