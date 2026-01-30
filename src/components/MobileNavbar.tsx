
import { useState, useEffect } from 'react';
import { Home, Car, Heart, User } from 'lucide-react';

const MobileNavbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 100) {
        if (window.scrollY > lastScrollY) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
        setLastScrollY(window.scrollY);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg transition-transform duration-300 md:hidden ${
        isVisible && scrollDirection === 'down' ? 'translate-y-0' : ''
      }`}
    >
      <div className="flex items-center justify-around h-16">
        <a 
          href="#" 
          className="flex flex-col items-center justify-center w-full py-1 text-primary"
        >
          <Home className="w-5 h-5" />
          <span className="mt-1 text-xs">Home</span>
        </a>
        
        <a 
          href="#" 
          className="flex flex-col items-center justify-center w-full py-1 text-gray-600"
        >
          <Car className="w-5 h-5" />
          <span className="mt-1 text-xs">Browse</span>
        </a>
        
        <a 
          href="#" 
          className="flex flex-col items-center justify-center w-full py-1 text-gray-600"
        >
          <Heart className="w-5 h-5" />
          <span className="mt-1 text-xs">Saved</span>
        </a>
        
        <a 
          href="#" 
          className="flex flex-col items-center justify-center w-full py-1 text-gray-600"
        >
          <User className="w-5 h-5" />
          <span className="mt-1 text-xs">Account</span>
        </a>
      </div>
    </div>
  );
};

export default MobileNavbar;
