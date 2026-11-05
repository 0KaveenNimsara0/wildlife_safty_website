import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function UserLayout() {
  const { pathname } = useLocation();
  const isCommunityFeed = pathname.replace(/\/$/, "") === "/communityFeed";
  const isChat = pathname.replace(/\/$/, "") === "/chat";
  return (
    <div className={isChat ? "h-dvh min-h-0 flex flex-col overflow-hidden" : "min-h-screen flex flex-col"}>
      <Header />
      <main className={isChat ? "flex-1 min-h-0 flex flex-col" : "flex-grow pt-8 pb-16"}>
        <div className={isChat ? "w-full flex-1 min-h-0 flex flex-col" : `mx-auto w-full px-4 sm:px-6 lg:px-8 ${isCommunityFeed ? "" : "max-w-7xl"}`}>
          <Outlet />
        </div>
      </main>
      {!isChat && <Footer />}
    </div>
  );
}
