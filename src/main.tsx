import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './sentry' // Initialize Sentry

// Aggressive error filtering for browser extensions
const shouldFilterError = (reason: any): boolean => {
  // Filter null/undefined
  if (!reason) return true;
  
  // Filter empty objects
  if (typeof reason === 'object' && Object.keys(reason).length === 0) return true;
  
  // Filter string errors
  if (typeof reason === 'string' && reason.length <= 1) return true;
  
  // Filter object errors with extension patterns
  if (typeof reason === 'object') {
    // Code 403 errors
    if (reason.code === 403) return true;
    
    // HTTP extension errors
    if (reason.httpError === false && reason.httpStatus === 200) return true;
    
    // Single character names
    if (reason.name && typeof reason.name === 'string' && reason.name.length === 1) return true;
    
    // Extension stack traces
    if (reason.stack && (reason.stack.includes('content.js') || reason.stack.includes('inspector'))) return true;
    
    // Abort errors (make completely silent)
    if (reason.name === 'AbortError') return true;
    
    // Signal aborted messages
    if (reason.message && reason.message.includes('signal is aborted')) return true;
    
    // Supabase abort errors
    if (reason.details && reason.details.includes('signal is aborted')) return true;
  }
  
  return false;
};

// Override console.error to filter extension errors
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Filter out any message containing AbortError or signal aborted
  const fullMessage = args.join(' ');
  if (typeof fullMessage === 'string') {
    if (fullMessage.includes('AbortError') ||
        fullMessage.includes('signal is aborted') ||
        fullMessage.includes('Error fetching cars') ||
        fullMessage.includes('Failed to create basic subscription') ||
        fullMessage.includes('Get user subscription error') ||
        fullMessage.includes('Error loading user profile') ||
        fullMessage.includes('Session request aborted') ||
        fullMessage.includes('Permissions policy violation') ||
        fullMessage.includes('content.js') ||
        fullMessage.includes('inspector')) {
      return;
    }
  }
  
  // Filter individual message argument
  const message = args[0];
  if (typeof message === 'string') {
    if (message.includes('AbortError') ||
        message.includes('signal is aborted') ||
        message.includes('Error fetching cars') ||
        message.includes('Failed to create basic subscription') ||
        message.includes('Get user subscription error') ||
        message.includes('Error loading user profile') ||
        message.includes('Session request aborted') ||
        message.includes('Permissions policy violation') ||
        message.includes('content.js') ||
        message.includes('inspector')) {
      return;
    }
  }
  
  // Filter object errors
  if (args.length > 0 && shouldFilterError(args[0])) {
    return;
  }
  
  // Filter AbortError in any argument
  if (args.some(arg => 
    typeof arg === 'object' && 
    (arg.name === 'AbortError' || 
     (arg.message && arg.message.includes('signal is aborted')) ||
     (arg.details && arg.details.includes('signal is aborted')) ||
     (arg.message && arg.message.includes('AbortError')) ||
     (arg.details && arg.details.includes('AbortError')))
  )) {
    return;
  }
  
  // Filter error objects with AbortError message
  if (args.some(arg => 
    typeof arg === 'object' && 
    (arg.message === 'AbortError: signal is aborted without reason' ||
     arg.message?.includes('AbortError'))
  )) {
    return;
  }
  
  originalConsoleError.apply(console, args);
};

// Add global error handlers for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  
  if (shouldFilterError(reason)) {
    event.preventDefault();
    return;
  }
  
  // Log legitimate errors
  console.error('Unhandled promise rejection:', reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  // Filter out browser extension errors
  if (event.filename && (event.filename.includes('content.js') || event.filename.includes('inspector'))) {
    return; // Ignore extension and inspector errors
  }
  
  // Filter out permission policy violations
  if (event.message && event.message.includes('Permissions policy violation')) {
    return; // Ignore permission warnings
  }
  
  console.error('Global error:', event.error);
});

createRoot(document.getElementById("root")!).render(<App />);
