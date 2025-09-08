"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { gsap } from "gsap";
import { notFoundContent } from "@/constants/not-found";

/**
 * 404错误页面
 * 现代简约炫酷的设计，适配主题色
 */
const NotFoundPage = () => {
  const { language } = useApp();
  const containerRef = useRef(null);
  const numberRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const particlesRef = useRef([]);

  const currentContent = notFoundContent[language] || notFoundContent["zh-cn"];

  useEffect(() => {
    if (typeof gsap === "undefined") return;

    const ctx = gsap.context(() => {
      // 创建时间线
      const tl = gsap.timeline();

      // 404数字动画
      tl.fromTo(numberRef.current,
        { 
          scale: 0,
          rotation: -180,
          opacity: 0
        },
        { 
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        }
      );

      // 文字动画
      tl.fromTo(textRef.current,
        { 
          y: 50,
          opacity: 0
        },
        { 
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        },
        "-=0.6"
      );

      // 按钮动画
      tl.fromTo(buttonRef.current,
        { 
          y: 30,
          opacity: 0
        },
        { 
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        },
        "-=0.4"
      );

      // 粒子动画
      particlesRef.current.forEach((particle, index) => {
        gsap.fromTo(particle,
          {
            scale: 0,
            opacity: 0,
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100
          },
          {
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.3 + 0.1,
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: index * 0.1
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center relative overflow-hidden"
    >
      {/* 背景粒子 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (particlesRef.current[i] = el)}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* 主要内容 */}
      <div className="text-center px-4 max-w-2xl mx-auto relative z-10">
        {/* 404数字 */}
        <div 
          ref={numberRef}
          className="mb-8"
        >
          <h1 className="text-8xl sm:text-9xl font-black text-primary/20 dark:text-primary/30 select-none">
            404
          </h1>
        </div>

        {/* 文字内容 */}
        <div ref={textRef} className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {currentContent.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {currentContent.subtitle}
          </p>
          <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
            {currentContent.description}
          </p>
        </div>

        {/* 建议列表 */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentContent.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-muted-foreground bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3"
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 返回按钮 */}
        <div ref={buttonRef}>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            {currentContent.button}
          </Link>
        </div>
      </div>

      {/* 装饰性几何图形 */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-primary/5 rounded-lg rotate-45 animate-pulse"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-primary/20 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-10 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-pulse"></div>
    </div>
  );
};

export default NotFoundPage;
