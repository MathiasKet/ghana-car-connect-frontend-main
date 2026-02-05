
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu,
  User,
  Car,
  Search,
  AlignRight,
  X,
  Users
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <Car className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">
            <span className="text-primary">Car</span>
            <span className="text-secondary">Connect</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link to="/buy" className="text-sm font-medium hover:text-primary">Buy</Link>
          <Link to="/rent" className="text-sm font-medium hover:text-primary">Rent</Link>
          <Link to="/sell" className="text-sm font-medium hover:text-primary">Sell</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">About</Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/list-car">
                <Button size="sm">
                  List Your Car
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="p-2 md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <AlignRight className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col pt-16 bg-white md:hidden">
          <div className="container px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <Link to="/buy" className="flex items-center py-2 text-lg font-medium border-b">
                <Search className="w-5 h-5 mr-3" /> Buy Cars
              </Link>
              <Link to="/rent" className="flex items-center py-2 text-lg font-medium border-b">
                <Car className="w-5 h-5 mr-3" /> Rent a Car
              </Link>
              <Link to="/sell" className="flex items-center py-2 text-lg font-medium border-b">
                <Menu className="w-5 h-5 mr-3" /> Sell Your Car
              </Link>
              <Link to="/about" className="flex items-center py-2 text-lg font-medium border-b">
                <Users className="w-5 h-5 mr-3" /> About Us
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center py-2 text-lg font-medium border-b">
                    <User className="w-5 h-5 mr-3" /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center py-2 text-lg font-medium border-b text-left"
                  >
                    <X className="w-5 h-5 mr-3" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center py-2 text-lg font-medium border-b">
                    <User className="w-5 h-5 mr-3" /> Sign In
                  </Link>
                  <Link to="/register" className="flex items-center py-2 text-lg font-medium border-b">
                    <User className="w-5 h-5 mr-3" /> Sign Up
                  </Link>
                </>
              )}
            </nav>
            <div className="mt-8">
              <Link to={user ? "/list-car" : "/register"}>
                <Button className="w-full">List Your Car</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
