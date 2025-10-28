import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import PostPage from './pages/post/post';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
 return (
    <BrowserRouter>
      <Routes>
        {/* route public */}
        <Route path="/login" element={<Login />} />
        {/* route protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostPage />
            </ProtectedRoute>
          }
        />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App