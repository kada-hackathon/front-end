import {Navigate} from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    
    // Debug logging (remove in production)
    console.log('ProtectedRoute check - token:', token ? 'exists' : 'null/empty');
    
    // Check if token exists and is not empty
    if (!token || token.trim() === '') {
        console.log('Redirecting to login - no valid token');
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default ProtectedRoute;