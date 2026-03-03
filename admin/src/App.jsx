import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import VerifyAppeal from './pages/VerifyAppeal';
import Layout from './components/Layout';

function App() {
  const token = localStorage.getItem('asanAdminToken');

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
      <Route element={token ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/verify/:id" element={<VerifyAppeal />} />
      </Route>
    </Routes>
  );
}

export default App;
