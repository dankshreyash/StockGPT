import React from 'react';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <div className="antialiased min-h-screen">
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: theme === 'dark' 
            ? { background: '#18181b', color: '#fff', border: '1px solid #27272a' }
            : { background: '#fff', color: '#18181b', border: '1px solid #e4e4e7' }
        }} 
      />
      <Home />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
