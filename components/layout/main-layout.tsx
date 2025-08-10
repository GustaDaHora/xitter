"use client";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import NotificationListener from "./notification-listener";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="bottom-center" />
      <NotificationListener />
      <Header toggleMenu={toggleMenu} />
      <div className="flex flex-1">
        <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
