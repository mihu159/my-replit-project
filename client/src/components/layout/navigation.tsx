import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Dumbbell } from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/", active: window.location.pathname === "/" },
    { name: "Analysis", href: "/analysis", active: window.location.pathname === "/analysis" },
    { name: "Progress", href: "/progress", active: window.location.pathname === "/progress" },
    { name: "Education", href: "/education", active: window.location.pathname === "/education" },
    ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin", active: window.location.pathname === "/admin" }] : []),
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Dumbbell className="text-primary text-2xl mr-3" />
              <span className="text-xl font-bold text-gray-900">PostureTrack Pro</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.active
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5 text-gray-600 hover:text-gray-900" />
            </Button>
            <div className="relative">
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage 
                  src={user?.profileImageUrl} 
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
