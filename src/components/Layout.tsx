import React from 'react';
import { Outlet } from 'react-router-dom';
import { MadeWithDyad } from './made-with-dyad';

const Layout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">FlexQR</h1>
      </header>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto flex items-center justify-center">
        <Outlet />
      </main>
      <div className="mt-auto">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Layout;