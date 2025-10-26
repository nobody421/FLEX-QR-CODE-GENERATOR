import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { QrCode, Youtube, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MadeWithDyad } from './made-with-dyad';

const Layout = () => {
  const { supabase } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { href: '/qr-generator', label: 'QR Generator', icon: QrCode },
    { href: '/youtube-uploader', label: 'YouTube Uploader', icon: Youtube },
  ];

  return (
    <div className="min-h-screen w-full flex bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-4 flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">FlexQR</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                  location.pathname === item.href && 'bg-gray-200 dark:bg-gray-700 font-semibold'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Button onClick={handleLogout} variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
           <h1 className="text-xl font-bold text-gray-900 dark:text-white">FlexQR</h1>
           <Button onClick={handleLogout} variant="destructive" size="icon">
              <LogOut className="h-4 w-4" />
           </Button>
        </header>
        
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
        <div className="mt-auto">
          <MadeWithDyad />
        </div>
      </main>
    </div>
  );
};

export default Layout;