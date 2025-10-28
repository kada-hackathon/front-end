import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import PostPage from './pages/post/post';
import Login from './components/Login/Login.jsx';
import Editor from '@/components/TiptapEditor/Editor'; 
import './index.css';
import MenuBar from './components/menubar/menubar';
import Navbar from './components/navbar/navbar';
import FriendsList from './components/friends-list/friend-list';

function App() {
    return (
      <>
      <MenuBar />
      <Navbar />
      <Editor />
      </>
  );
}

export default App;