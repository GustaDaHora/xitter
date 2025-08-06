"use client";

import { Button } from "@/components/ui/button";
import { IQBadge } from "@/components/ui/iq-badge";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Brain,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header({ toggleMenu }: { toggleMenu: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-11 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Link
          href="/"
          className="logo hidden items-center gap-2 font-bold text-xl md:flex"
        >
          <div className="rounded-full bg-gradient-primary p-2">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="bg-gradient-iq bg-clip-text text-transparent">
            Xitter
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts and users..."
            className="w-full rounded-full border border-border bg-muted py-2 pl-10 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {session ? (
          <>
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>

              <IQBadge iq={session.user.iqScore} size="sm" />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
