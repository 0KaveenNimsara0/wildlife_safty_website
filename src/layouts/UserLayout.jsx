import React from 'react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function UserLayout({ children, page, setPage, setAuthPage }) {
  return (
    <>
      <Header page={page} setPage={setPage} setAuthPage={setAuthPage} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer setPage={setPage} />
    </>
  );
}
