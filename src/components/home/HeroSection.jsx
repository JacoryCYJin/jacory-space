"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";
import { heroTexts } from "@/constants/home/HeroSection";

/**
 * ActionLink - 可复用的操作链接组件
 * @param {string} href - 链接地址
 * @param {string} icon - 图标类型 ('github' | 'heart')
 * @param {string} text - 显示文本
 */
const ActionLink = ({ href, icon, text }) => {
  const iconSvg = icon === 'github' ? (
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  ) : (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center bg-primary/10 dark:bg-primary/15 transition-all duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl min-w-[280px] border border-primary/20 hover:border-primary/30 relative z-10 hover:bg-primary/20 dark:hover:bg-primary/25"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/60 dark:from-primary/45 dark:to-primary/65 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0 opacity-0 group-hover:opacity-100"></div>
      <div className="w-16 h-14 bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center justify-center relative z-10">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
          <svg
            className="w-6 h-6 text-primary hover:text-primary/80 transition-colors duration-300"
            fill={icon === 'github' ? 'currentColor' : 'none'}
            stroke={icon === 'heart' ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
          >
            {iconSvg}
          </svg>
        </div>
      </div>
      <div className="flex-1 px-6 py-4 flex items-center justify-between relative z-10">
        <span className="text-primary font-bold text-sm uppercase tracking-wider hover:text-primary/90 transition-colors duration-300">
          {text}
        </span>
        <svg
          className="w-4 h-4 text-primary/70 hover:text-primary hover:translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </div>
    </a>
  );
};

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HeroSection - 首页英雄区域组件
 * 包含品牌标题、副标题、滚动指示器和底部链接
 * 使用GSAP实现动画效果和交互体验
 */
export default function HeroSection() {
  const { language } = useApp();
  const currentTexts = heroTexts[language];

  // Refs for animation targets
  const heroRef = useRef(null);
  const jRef = useRef(null);
  const spaceRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const bottomDescriptionRef = useRef(null);
  const bottomLinksRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Animation timeline configuration
      const animationConfig = {
        ease: "power2.out",
        stagger: 0.2,
      };

      // Brand title animations - J appears first, then SPACE
      gsap.fromTo(jRef.current, {
        opacity: 0, y: 30, scale: 0.8
      }, {
        opacity: 1, y: 0, scale: 1,
        duration: 1.5,
        ease: animationConfig.ease,
        delay: 0.2,
      });

      gsap.fromTo(spaceRef.current, {
        opacity: 0, y: 20, x: 20
      }, {
        opacity: 1, y: 0, x: 0,
        duration: 1.2,
        ease: animationConfig.ease,
        delay: 0.8,
      });

      // Subtitle and UI elements fade-in sequence
      const uiElements = [
        { ref: subtitleRef, delay: 1.4, y: 15 },
        { ref: scrollIndicatorRef, delay: 2.0, y: 0 },
        { ref: bottomDescriptionRef, delay: 2.2, y: 0 },
        { ref: bottomLinksRef, delay: 2.4, y: 0 },
      ];

      uiElements.forEach(({ ref, delay, y }) => {
        gsap.fromTo(ref.current, {
          opacity: 0, y: y
        }, {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: animationConfig.ease,
          delay,
        });
      });

      // Scroll-triggered animations
      const setupScrollAnimations = () => {
        // Hide scroll indicator on scroll
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(scrollIndicatorRef.current, {
              opacity: 1 - progress * 2,
              y: progress * 20,
              duration: 0.3,
              ease: "power2.out",
            });
          },
        });

        // Parallax effect on scroll
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            const titleElements = [jRef.current, spaceRef.current];
            
            titleElements.forEach(element => {
              gsap.to(element, {
                scale: 1 - progress * 0.02,
                opacity: 1 - progress * 0.1,
                y: progress * -20,
                duration: 0.1,
              });
            });
          },
        });
      };

      // Mouse parallax effect
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xPos = (clientX / innerWidth - 0.5) * 8;
        const yPos = (clientY / innerHeight - 0.5) * 8;

        gsap.to(jRef.current, { x: xPos, y: yPos, duration: 0.8, ease: "power1.out" });
        gsap.to(spaceRef.current, { x: xPos * 0.8, y: yPos * 0.8, duration: 0.8, ease: "power1.out" });
      };

      // Initialize scroll animations and mouse events
      setupScrollAnimations();
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background"
    >
      {/* Background gradient and ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/3" />
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-primary/8 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-primary/4 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Main brand title */}
      <div className="absolute inset-0 flex z-10 mt-14">
        <h1
          className="text-[10vw] md:text-[15vw] lg:text-[20vw] xl:text-[25vw] font-black leading-none text-center"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 0 40px rgba(94, 116, 86, 0.3)",
            transformStyle: "preserve-3d",
            width: "100vw",
            maxWidth: "100%",
          }}
        >
          <span ref={jRef} className="italic text-primary mr-[0.1em]">J</span>
          <span ref={spaceRef} className="text-black dark:text-white tracking-tighter">SPACE</span>
        </h1>
      </div>

      {/* Subtitle positioned to the right */}
      <div className="absolute top-1/2 right-[5%] z-10">
        <h2
          ref={subtitleRef}
          className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-foreground/80 tracking-wider uppercase text-right"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 0 20px rgba(94, 116, 86, 0.2)",
          }}
        >
          {currentTexts.subtitle}
        </h2>
      </div>

      {/* Scroll indicator with animated line */}
      <div ref={scrollIndicatorRef} className="absolute bottom-14 left-14 flex items-center space-x-4 h-14">
        <div className="relative">
          <div className="w-0.5 h-12 bg-foreground/20" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-foreground/60 animate-pulse" />
        </div>
        <div className="flex flex-col text-foreground/60 text-base font-bold tracking-wider uppercase leading-tight space-y-1">
          <span>{currentTexts.scrollIndicator.scroll}</span>
          <span>{currentTexts.scrollIndicator.toExplore}</span>
        </div>
      </div>

      {/* Bottom description text */}
      <div ref={bottomDescriptionRef} className="absolute bottom-14 left-80 max-w-2xl px-8 flex items-center h-14">
        <p className="text-foreground/60 text-sm md:text-base font-light leading-relaxed text-left">
          {currentTexts.description}
        </p>
      </div>

      {/* Bottom action links */}
      <div ref={bottomLinksRef} className="absolute bottom-14 right-14 flex flex-row space-x-4 items-center h-14 z-20">
        {/* GitHub link */}
        <ActionLink
          href="https://github.com/your-username"
          icon="github"
          text={currentTexts.links.github}
        />

        {/* Support link */}
        <ActionLink
          href="https://your-support-link.com"
          icon="heart"
          text={currentTexts.links.support}
        />
      </div>
    </section>
  );
}
