import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home,
  MessageSquare,
  Book,
  Users,
  Music,
  Calendar,
  User as UserIcon,
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", url: createPageUrl("Dashboard"), icon: Home },
  { title: "AI Friend", url: createPageUrl("Chat"), icon: MessageSquare },
  { title: "My Diary", url: createPageUrl("Diary"), icon: Book },
  { title: "Peer Forum", url: createPageUrl("Forum"), icon: Users },
  { title: "Relaxation", url: createPageUrl("Resources"), icon: Music },
  { title: "Booking", url: createPageUrl("Booking"), icon: Calendar },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/90 backdrop-blur-lg">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-bold text-xl text-white">C</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">CampusMind</h2>
                <p className="text-xs text-slate-500 font-medium">Your space to reflect</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 rounded-lg mb-1 font-medium ${
                          location.pathname === item.url 
                            ? 'bg-teal-50 text-teal-700 border-r-2 border-teal-500' 
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-6">
            <Link to={createPageUrl("Profile")} className="w-full">
                <div className="flex items-center gap-3 hover:bg-slate-100 p-2 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">My Profile</p>
                    <p className="text-xs text-slate-500 truncate">Settings & Preferences</p>
                  </div>
                </div>
            </Link>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold text-slate-800">CampusMind</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
