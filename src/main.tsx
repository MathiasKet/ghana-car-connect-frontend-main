import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './sentry' // Initialize Sentry

// Aggressive error filtering for browser extensions
const shouldFilterError = (reason: any): boolean => {
  // Filter null/undefined
  if (!reason) return true;

  // Filter empty objects or generic objects with minimal properties
  if (typeof reason === 'object') {
    if (Object.keys(reason).length === 0) return true;

    // Filter out common extension error patterns
    if (reason.stack && (reason.stack.includes('content.js') || reason.stack.includes('extension') || reason.stack.includes('inspector'))) return true;
    if (reason.message === 'Script error.') return true;
    if (reason.name === 'AbortError') return true;

    // Filter object errors with extension patterns
    if (reason.code === 403) return true;
    if (reason.httpError === false && reason.httpStatus === 200) return true;
    if (reason.name && typeof reason.name === 'string' && reason.name.length === 1) return true;
    if (reason.message && (reason.message.includes('signal is aborted') || reason.message.includes('content.js'))) return true;
  }

  // Filter string errors
  if (typeof reason === 'string') {
    if (reason.length <= 1) return true;
    if (reason.includes('content.js') || reason.includes('extension') || reason.includes('AbortError')) return true;
  }

  return false;
};

// Override console.error to filter extension errors
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // If the first argument is something we should filter, ignore the whole thing
  if (args.length > 0 && shouldFilterError(args[0])) {
    return;
  }

  // Filter out any message containing common noise
  const fullMessage = args.map(arg => {
    try {
      return typeof arg === 'string' ? arg : JSON.stringify(arg);
    } catch (e) {
      return String(arg);
    }
  }).join(' ');

  const noiseKeywords = [
    'AbortError',
    'signal is aborted',
    'without reason',
    'Error fetching cars',
    'Failed to create basic subscription',
    'Get user subscription error',
    'Error loading user profile',
    'Session request aborted',
    'Permissions policy violation',
    'content.js',
    'extension',
    'inspector',
    'react-devtools'
  ];

  if (noiseKeywords.some(keyword => fullMessage.includes(keyword))) {
    return;
  }

  originalConsoleError.apply(console, args);
};

window.addEventListener('error', (event) => {
  // Handle chunk load errors (Vite dynamic import failures)
  // This happens after a deployment when old hashes are referenced by client
  if (
    event.message &&
    (event.message.includes('Failed to fetch dynamically imported module') ||
      event.message.includes('Importing a module script failed') ||
      event.message.includes('error loading dynamically imported module'))
  ) {
    console.warn('Chunk load error detected. Reloading page...');
    window.location.reload();
    return;
  }

  // Filter out browser extension errors
  if (event.filename && (event.filename.includes('content.js') || event.filename.includes('extension') || event.filename.includes('inspector'))) {
    event.preventDefault();
    return;
  }

  // Filter out permission policy violations
  if (event.message && (event.message.includes('Permissions policy violation') || event.message.includes('Script error.'))) {
    event.preventDefault();
    return;
  }

  console.error('Global error:', event.error || event.message);
});

// Better handling for the "Uncaught (in promise) Object" issue
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;

  if (shouldFilterError(reason)) {
    event.preventDefault();
    return;
  }

  // Special handling for dynamic import failures in promises
  const reasonMessage = reason?.message || String(reason);
  if (reasonMessage.includes('Failed to fetch dynamically imported module')) {
    console.warn('Chunk load error in promise detected. Reloading page...');
    window.location.reload();
    return;
  }

  // Log legitimate errors through our filtered console.error
  const errorToLog = reason instanceof Error ? reason : JSON.stringify(reason);
  console.error('Unhandled promise rejection:', errorToLog);
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(<App />);
