"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { gsap } from "gsap";
import { notFoundContent } from "@/constants/not-found";

/**
 * 404错误页面 - 动态效果和粒子动画
 * 作者：JacoryJin
 */
const NotFoundPage = () => {
  const { language } = useApp();
  const containerRef = useRef(null);
  const numberRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const particlesRef = useRef([]);
  const [isClient, setIsClient] = useState(false);

  const currentContent = notFoundContent[language] || notFoundContent["zh-cn"];

  // 生成背景粒子位置
  const generateParticlePositions = () => {
    const positions = [];
    for (let i = 0; i < 30; i++) {
      const seed = i * 0.1;
      const left = Math.round((Math.sin(seed) * 0.5 + 0.5) * 100 * 100) / 100;
      const top = Math.round((Math.cos(seed * 1.3) * 0.5 + 0.5) * 100 * 100) / 100;
      const size = Math.round(((Math.sin(seed * 0.3) * 0.5 + 0.5) * 3 + 1) * 100) / 100;
      positions.push({
        left,
        top,
        size,
      });
    }
    return positions;
  };

  const particlePositions = generateParticlePositions();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof gsap === "undefined" || !isClient) return;

    const ctx = gsap.context(() => {
      // 创建主时间线
      const tl = gsap.timeline();

      // 404数字动画 - 更炫酷的效果
      tl.fromTo(numberRef.current,
        { 
          scale: 0,
          opacity: 0,
          rotation: -180
        },
        { 
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.2,
          ease: "back.out(1.7)"
        }
      );

      // 文字内容动画
      tl.fromTo(textRef.current,
        { 
          y: 60,
          opacity: 0
        },
        { 
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        },
        "-=0.6"
      );

      // 按钮动画
      tl.fromTo(buttonRef.current,
        { 
          y: 40,
          opacity: 0,
          scale: 0.8
        },
        { 
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)"
        },
        "-=0.4"
      );

      // 背景粒子动画 - 更流畅的浮动效果
      particlesRef.current.forEach((particle, index) => {
        if (particle) {
          gsap.fromTo(particle,
            {
              scale: 0,
              opacity: 0,
              x: 0,
              y: 0
            },
            {
              scale: 1,
              opacity: 0.3,
              x: (Math.sin(index * 0.5) * 30),
              y: (Math.cos(index * 0.7) * 30),
              duration: 3 + (index * 0.1),
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: index * 0.05
            }
          );
        }
      });

      // 添加鼠标跟随效果
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 20;
        const yPos = (clientY / innerHeight - 0.5) * 20;
        
        gsap.to(numberRef.current, {
          x: xPos,
          y: yPos,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };

    }, containerRef);

    return () => ctx.revert();
  }, [isClient]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center relative overflow-hidden"
    >
      {/* 背景粒子 */}
      <div className="absolute inset-0 pointer-events-none">
        {particlePositions.map((position, i) => (
          <div
            key={i}
            ref={(el) => (particlesRef.current[i] = el)}
            className="absolute bg-primary/30 dark:bg-primary/40 rounded-full"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
              width: `${position.size}px`,
              height: `${position.size}px`,
            }}
          />
        ))}
      </div>

      {/* 装饰性几何图形 */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-primary/5 rounded-lg rotate-45 animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-pulse"></div>

      {/* 主要内容 */}
      <div className="text-center px-4 max-w-4xl mx-auto relative z-10">
        {/* 404数字 - 大而炫酷 */}
        <div 
          ref={numberRef}
          className="mb-12 relative"
        >
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60 leading-none">
              404
            </h1>
            {/* 发光效果 */}
            <div className="absolute inset-0 text-8xl sm:text-9xl md:text-[12rem] font-black text-primary/20 blur-sm leading-none">
              404
            </div>
          </div>
        </div>

        {/* 文字内容 */}
        <div ref={textRef} className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {currentContent.title}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
          <p className="text-base text-muted-foreground/80 max-w-xl mx-auto">
            {currentContent.description}
          </p>
        </div>

        {/* 建议列表 - 更现代的设计 */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {currentContent.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="group flex items-center text-sm text-muted-foreground bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl px-6 py-4 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 hover:scale-105"
              >
                <div className="w-2 h-2 bg-primary rounded-full mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                <span className="group-hover:text-foreground transition-colors duration-300">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 返回按钮 - 更炫酷的设计 */}
        <div ref={buttonRef}>
          <Link
            href="/"
            className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-2xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/30 relative overflow-hidden"
          >
            {/* 按钮背景动画 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <svg
              className="w-6 h-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="relative z-10">{currentContent.button}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;