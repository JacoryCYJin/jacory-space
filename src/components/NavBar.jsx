"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { useApp } from "@/lib/context";
import { navTexts } from "@/constants/NavBar";

const NavBar = () => {
  const { language } = useApp();
  
  const currentTexts = navTexts[language];
  
  return (
    <nav className="flex flex-row justify-between items-center px-8 py-2 fixed w-screen z-10 bg-gray-200">
      <div>
        <div>{currentTexts.navbar}</div>
      </div>
      <div className="flex flex-row justify-between items-center space-x-16">
        <Link href="/">{currentTexts.home}</Link>
        <Link href="/">{currentTexts.portfolio}</Link>
        <Link href="/">{currentTexts.blog}</Link>
        <Link href="/">{currentTexts.about}</Link>
        <Link href="/">{currentTexts.contact}</Link>
      </div>
      <div className="flex items-center space-x-3">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default NavBar;
