"use client";
import { useState } from "react";
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
    <div className="container mx-auto flex min-h-screen">
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main className="flex-1 border-x">
        <Header toggleMenu={toggleMenu} />
        {children}
      </main>
    </div>
  );
}
