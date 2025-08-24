"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { useApp } from "@/lib/context";
import { navTexts } from "@/constants/NavBar";

const NavBar = () => {
  const { language } = useApp();
  const pathname = usePathname();
  
  const currentTexts = navTexts[language];
  
  // 导航项配置
  const navItems = [
    { href: "/", label: currentTexts.home },
    { href: "/portfolio", label: currentTexts.portfolio },
    { href: "/blog", label: currentTexts.blog },
    { href: "/about", label: currentTexts.about },
    { href: "/contact", label: currentTexts.contact }
  ];
  
  // 判断当前路径是否为激活状态
  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };
  
  return (
    <nav className="flex flex-row justify-between items-center px-8 py-2 fixed w-screen z-10 dark:bg-gray-900/80 backdrop-blur-sm">
      <div>
        <div className="font-semibold text-lg">{currentTexts.navbar}</div>
      </div>
      <div className="flex flex-row justify-between items-center space-x-30">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-all duration-200 hover:text-primary ${
              isActive(item.href)
                ? "font-bold text-primary"
                : "font-medium text-gray-700 dark:text-gray-300 hover:font-semibold"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-3">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default NavBar;
