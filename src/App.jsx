import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import PostPage from './pages/post/post';

function App() {
 return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </Router>
  )
}

export default App