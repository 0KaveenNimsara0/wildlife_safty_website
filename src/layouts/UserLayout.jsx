import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function UserLayout() {
  const { pathname } = useLocation();
  const isCommunityFeed = pathname.replace(/\/$/, "") === "/communityFeed";
  return (
    <>
      <Header />
      <main className="flex-grow pt-6 pb-12">
        <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${isCommunityFeed ? "" : "max-w-7xl"}`}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
