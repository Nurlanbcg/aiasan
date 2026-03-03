import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

export default function Sidebar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('asanAdminUser') || '{}');

    const links = [
        { to: '/', label: 'Panel', icon: LayoutDashboard },
        { to: '/users', label: 'İstifadəçilər', icon: Users },
    ];

    const handleLogout = () => {
        localStorage.removeItem('asanAdminToken');
        localStorage.removeItem('asanAdminUser');
        navigate('/login');
        window.location.reload();
    };

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold tracking-tight">ASAN Admin</h1>
                {user.firstName && (
                    <p className="text-sm text-slate-400 mt-1">{user.firstName} {user.lastName}</p>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${isActive
                                ? 'text-white'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                        style={({ isActive }) => isActive ? { backgroundColor: '#7852ff' } : {}}
                    >
                        <div className={`flex-shrink-0 p-2 rounded-full`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg hover:bg-red-500/10 hover:text-red-400 transition"
                >
                    <LogOut className="w-5 h-5" />
                    Çıxış
                </button>
            </div>
        </aside>
    );
}
