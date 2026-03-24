"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <div className="h-4 w-4 bg-background rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight">Charlie</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Link href="/profile">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">JD</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
