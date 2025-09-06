"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { AnimatedThemeToggler } from "./magicui/animated-theme-toggler";
import { useApp } from "@/lib/context";
import { navTexts } from "@/constants/NavBar";

/**
 * 网站导航栏组件
 * 包含品牌标识、导航菜单、主题切换器和语言切换器
 */
const NavBar = () => {
  const { language } = useApp();
  const pathname = usePathname();
  
  const currentTexts = navTexts[language];
  
  // 导航菜单项配置
  const navItems = [
    { href: "/", label: currentTexts.home },
    { href: "/portfolio", label: currentTexts.portfolio },
    { href: "/blog", label: currentTexts.blog },
    { href: "/about", label: currentTexts.about },
    { href: "/contact", label: currentTexts.contact }
  ];
  
  /**
   * 判断当前路径是否为激活状态
   * @param {string} href - 链接地址
   * @returns {boolean} 是否为激活状态
   */
  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };
  
  return (
    <nav className="flex flex-row justify-between items-center px-8 py-2 fixed w-screen z-100 backdrop-blur-sm">
      {/* 品牌标识区域 */}
      <div>
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold text-primary mr-0.5 italic">J</span>
          <span className="text-1xl font-bold">Space</span>
        </div>
      </div>
      
      {/* 导航菜单区域 */}
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
      
      {/* 工具按钮区域：主题切换器和语言切换器 */}
      <div className="flex items-center space-x-3">
        <AnimatedThemeToggler />
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default NavBar;
