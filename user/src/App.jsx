import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyAppeals from './pages/MyAppeals';
import SubmitAppeal from './pages/SubmitAppeal';
import AppealDetail from './pages/AppealDetail';
import Navbar from './components/Navbar';

function App() {
  const token = localStorage.getItem('asanToken');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/my-appeals" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/my-appeals" />} />
        <Route path="/my-appeals" element={token ? <MyAppeals /> : <Navigate to="/login" />} />
        <Route path="/appeals/:id" element={token ? <AppealDetail /> : <Navigate to="/login" />} />
        <Route path="/submit" element={token ? <SubmitAppeal /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
