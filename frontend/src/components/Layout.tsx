import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                KaamSetu
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {user.role === 'WORKER' && (
                    <Link to="/dashboard/worker" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'CUSTOMER' && (
                    <Link to="/dashboard/customer" className="text-gray-700 hover:text-primary-600">
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="text-gray-700 hover:text-primary-600">
                      Admin
                    </Link>
                  )}
                  <span className="text-gray-700">{user.name}</span>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-700">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link to="/auth/signup" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main>{children}</main>
      
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <p className="text-center">© 2024 KaamSetu - Connecting Workers with Opportunities</p>
        </div>
      </footer>
    </div>
  );
}

