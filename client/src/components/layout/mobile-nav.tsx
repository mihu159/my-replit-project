import { Home, Camera, TrendingUp, BookOpen, User } from "lucide-react";

export default function MobileNav() {
  const navItems = [
    { name: "Home", href: "/", icon: Home, active: window.location.pathname === "/" },
    { name: "Analyze", href: "/analysis", icon: Camera, active: window.location.pathname === "/analysis" },
    { name: "Progress", href: "/progress", icon: TrendingUp, active: window.location.pathname === "/progress" },
    { name: "Learn", href: "/education", icon: BookOpen, active: window.location.pathname === "/education" },
    { name: "Profile", href: "/profile", icon: User, active: window.location.pathname === "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                item.active ? "text-primary" : "text-gray-600"
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs mt-1">{item.name}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
