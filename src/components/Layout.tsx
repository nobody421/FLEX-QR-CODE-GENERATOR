import React from 'react';
import { Outlet } from 'react-router-dom';
import { MadeWithDyad } from './made-with-dyad';
import Navigation from './Navigation';

const Layout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
      <aside className="hidden md:flex md:w-64 flex-col border-r bg-background p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FlexQR</h1>
        </div>
        <Navigation />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 p-4 shadow-md md:hidden">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">FlexQR</h1>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
        <div className="mt-auto">
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

export default Layout;