import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./WorkLogList.css";
import { AUTH_ENDPOINTS, WORKLOG_ENDPOINTS } from "../../config/api";

const WorkLogList = ({ filters = { searchQuery: "", selectedTags: [], dateRange: { start: "", end: "" } } }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchParams] = useSearchParams();

  const handleWorkLogClick = (logId) => {
    navigate(`/blog-post?id=${logId}`);
  };

  const handleCreateNew = () => {
    navigate('/blog-editor'); // Navigate to BlogEditor without ID for create mode
  };

  useEffect(() => {
    const fetchUserWorklogs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Fetch current user ID
        const userResponse = await fetch(AUTH_ENDPOINTS.PROFILE, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = await userResponse.json();
        const currentUserId = userData.user?.id || userData.user?._id || userData.id || userData._id;
        
        // Build query params for filter
        const params = new URLSearchParams();
        if (filters?.searchQuery) params.append('search', filters.searchQuery);
        if (filters?.selectedTags?.length > 0) params.append('tag', filters.selectedTags.join(','));
        if (filters?.dateRange?.start) params.append('from', filters.dateRange.start);
        if (filters?.dateRange?.end) params.append('to', filters.dateRange.end);
        
        const queryString = params.toString();
        const url = `${WORKLOG_ENDPOINTS.FILTER}${queryString ? '?' + queryString : ''}`;
        
        // Fetch all worklogs dengan filters
        const worklogsResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!worklogsResponse.ok) {
          console.error('Filter response error:', worklogsResponse.status);
          setFilteredPosts([]);
          setLoading(false);
          return;
        }

        const worklogsData = await worklogsResponse.json();
        let allWorklogs = Array.isArray(worklogsData) ? worklogsData : (worklogsData?.worklogs || []);
        
        // Validate it's an array
        if (!Array.isArray(allWorklogs)) {
          console.error('Response worklogs is not an array:', allWorklogs);
          setFilteredPosts([]);
          setLoading(false);
          return;
        }
        
        // Filter: hanya yang user adalah owner atau collaborator
        const userWorklogs = allWorklogs.filter(worklog => {
          const isOwner = worklog.user?._id === currentUserId || worklog.user?.id === currentUserId;
          const isCollaborator = worklog.collaborators?.some(collab => 
            collab._id === currentUserId || collab.id === currentUserId
          );
          return isOwner || isCollaborator;
        });
        
        // Convert ke format untuk display
        const convertedPosts = userWorklogs.map((worklog) => ({
          id: worklog._id || worklog.id,
          title: worklog.title || "Untitled",
          hashtags: worklog.tag || [],
          description: worklog.content?.substring(0, 100) || "No description",
          date: new Date(worklog.datetime || worklog.createdAt).toLocaleDateString('id-ID'),
          time: new Date(worklog.datetime || worklog.createdAt).toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }));
        
        // Sort by date terbaru
        convertedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setFilteredPosts(convertedPosts);
      } catch (error) {
        console.error('Error fetching worklogs:', error);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWorklogs();
  }, [filters]);

  return (
    <div className="worklog-list">
      <Button onClick={handleCreateNew} className="create-new-button">
        <span className="create-new-icon">📋</span>
        CREATE NEW
      </Button>

      <h2 className="worklog-list-title">MY WORK PROJECT</h2>

      <div className="worklog-items-container">
        {loading ? (
          <div className="text-center py-8">Loading work logs...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">No work logs found</div>
        ) : (
          filteredPosts.map((log) => (
            <article 
              key={log.id} 
              className="worklog-item" 
              onClick={() => handleWorkLogClick(log.id)} 
              style={{ cursor: "pointer" }}
            >
              <h3 className="worklog-item-title">{log.title}</h3>

              <p className="worklog-item-hashtags">{log.hashtags.map(tag => `#${tag}`).join(" ")}</p>

              <p className="worklog-item-description">{log.description}</p>

              <div className="worklog-item-footer">
                <span className="worklog-item-date">
                  {log.date}
                  <br />
                  {log.time}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkLogList;