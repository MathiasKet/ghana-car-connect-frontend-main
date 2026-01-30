// Animation utilities and components using CSS transitions
import React, { useState, useEffect } from 'react';

// Fade in animation component
export const FadeIn = ({ children, delay = 0, duration = 0.5, className = '' }: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity duration-${Math.round(duration * 1000)} ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ 
        transitionDuration: `${duration}s`, 
        transitionDelay: `${delay}s`,
        opacity: isVisible ? 1 : 0 
      }}
    >
      {children}
    </div>
  );
};

// Slide in animation
export const SlideIn = ({ children, direction = 'up', delay = 0, duration = 0.5, className = '' }: {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translateY(20px)';
        case 'down': return 'translateY(-20px)';
        case 'left': return 'translateX(20px)';
        case 'right': return 'translateX(-20px)';
        default: return 'translateY(20px)';
      }
    }
    return 'translate(0, 0)';
  };

  return (
    <div
      className={`transition-all ${className}`}
      style={{ 
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionProperty: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

// Scale animation
export const ScaleIn = ({ children, delay = 0, duration = 0.3, className = '' }: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-transform ${className}`}
      style={{ 
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionProperty: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

// Hover effect component
export const HoverScale = ({ children, scale = 1.05, className = '' }: {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}) => {
  return (
    <div
      className={`transition-transform duration-200 hover:scale-${Math.round(scale * 100)} ${className}`}
      style={{ 
        transition: 'transform 0.2s ease-in-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
};

// Floating animation
export const Floating = ({ children, duration = 3, delay = 0, className = '' }: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}) => {
  return (
    <div
      className={`${className}`}
      style={{
        animation: `float ${duration}s ease-in-out ${delay}s infinite`
      }}
    >
      {children}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

// Pulse animation
export const Pulse = ({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`${className}`}
      style={{
        animation: 'pulse 2s ease-in-out infinite'
      }}
    >
      {children}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

// Stagger animation for lists
export const StaggerContainer = ({ children, staggerDelay = 0.1, className = '' }: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out',
            transitionDelay: `${index * staggerDelay}s`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Loading spinner
export const LoadingSpinner = ({ size = 'medium', className = '' }: {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div
      className={`${sizeMap[size]} border-2 border-primary border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
};

// Typing effect
export const TypingText = ({ text, className = '', delay = 0 }: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, 50 + delay * 1000);
    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span
          className="inline-block w-1 h-5 bg-primary ml-1 animate-pulse"
        />
      )}
    </span>
  );
};

// Animated button
export const AnimatedButton = ({ children, className = '', ...props }: any) => {
  return (
    <button
      className={`transition-all duration-200 transform hover:scale-105 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Page transition wrapper
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.3s ease-out'
      }}
    >
      {children}
    </div>
  );
};
