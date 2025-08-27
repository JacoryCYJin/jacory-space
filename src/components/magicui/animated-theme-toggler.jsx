"use client";
import { Moon, SunDim } from "lucide-react";
import { useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/context";

export const AnimatedThemeToggler = ({
  className
}) => {
  const { theme, toggleTheme, isDark } = useApp();
  const buttonRef = useRef(null);
  
  const changeTheme = async () => {
    if (!buttonRef.current) return;

    // 检查浏览器是否支持 View Transitions API
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate({
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${maxRad}px at ${x}px ${y}px)`,
      ],
    }, {
      duration: 700,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-new(root)",
    });
  };
  
  return (
    <button 
      ref={buttonRef} 
      onClick={changeTheme} 
      className={cn(
        "relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
        className
      )}
      aria-label={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
    >
      {isDark ? <SunDim className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
    </button>
  );
};
