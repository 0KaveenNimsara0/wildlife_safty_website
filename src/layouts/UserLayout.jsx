import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function UserLayout() {
  const [page, setPage] = useState('home');
  const [authPage, setAuthPage] = useState(null);

  return (
    <>
      <Header page={page} setPage={setPage} setAuthPage={setAuthPage} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer setPage={setPage} />
    </>
  );
}
