"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";
import { heroTexts } from "@/constants/home/HeroSection";

/**
 * 可复用的操作链接组件
 * 提供统一的链接样式和交互效果，支持GitHub和爱心图标
 *
 * @param {Object} props - 组件属性
 * @param {string} props.href - 链接目标地址
 * @param {'github' | 'heart'} props.icon - 图标类型，支持GitHub和爱心图标
 * @param {string} props.text - 链接显示文本
 * @returns {JSX.Element} 渲染的操作链接组件
 */
const ActionLink = ({ href, icon, text }) => {
  const iconSvg =
    icon === "github" ? (
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center bg-primary/10 dark:bg-primary/15 transition-all duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl min-w-[280px] border border-primary/20 hover:border-primary/30 relative hover:bg-primary/20 dark:hover:bg-primary/25"
      style={{ zIndex: 10 }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/60 dark:from-primary/45 dark:to-primary/65 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100"
        style={{ zIndex: 0 }}
      ></div>
      <div
        className="w-16 h-14 bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center justify-center relative"
        style={{ zIndex: 10 }}
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
          <svg
            className="w-6 h-6 text-primary hover:text-primary/80 transition-colors duration-300"
            fill={icon === "github" ? "currentColor" : "none"}
            stroke={icon === "heart" ? "currentColor" : "none"}
            viewBox="0 0 24 24"
          >
            {iconSvg}
          </svg>
        </div>
      </div>
      <div
        className="flex-1 px-6 py-4 flex items-center justify-between relative"
        style={{ zIndex: 10 }}
      >
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

// 注册GSAP插件
// 确保在客户端环境中正确注册ScrollTrigger插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * 首页英雄区域组件
 *
 * 这是网站的核心视觉组件，负责展示品牌标识和引导用户交互。
 * 主要功能包括：
 * - 品牌标题动画展示（J SPACE）
 * - 响应式布局适配
 * - 滚动交互效果（J元素放大过渡）
 * - 鼠标视差效果
 * - 多语言支持
 *
 * @returns {JSX.Element} 渲染的英雄区域组件
 */
export default function HeroSection() {
  const { language } = useApp();
  const currentTexts = heroTexts[language];

  // 动画目标元素的引用
  const heroRef = useRef(null);
  const jRef = useRef(null);
  const jBackgroundRef = useRef(null);
  const spaceRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const bottomDescriptionRef = useRef(null);
  const bottomLinksRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // 动画时间轴配置参数
      const animationConfig = {
        ease: "power2.out",
        stagger: 0.2,
      };

      // 品牌标题动画序列 - J元素先出现，然后SPACE元素
      gsap.fromTo(
        jRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: animationConfig.ease,
          delay: 0.2,
        }
      );

      gsap.fromTo(
        spaceRef.current,
        {
          opacity: 0,
          y: 20,
          x: 20,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 1.2,
          ease: animationConfig.ease,
          delay: 0.8,
        }
      );

      // 副标题和UI元素的渐入动画序列
      const uiElements = [
        { ref: subtitleRef, delay: 1.4, y: 15 },
        { ref: scrollIndicatorRef, delay: 2.0, y: 0 },
        { ref: bottomDescriptionRef, delay: 2.2, y: 0 },
        { ref: bottomLinksRef, delay: 2.4, y: 0 },
      ];

      uiElements.forEach(({ ref, delay, y }) => {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: animationConfig.ease,
            delay,
          }
        );
      });

      /**
       * 核心滚动交互效果配置
       * 实现J元素随滚动放大，其他元素渐隐的过渡效果
       */
      const setupScrollAnimations = () => {
        // 创建滚动触发器，控制J元素的缩放动画
        ScrollTrigger.create({
          id: "hero-scroll",
          trigger: heroRef.current,
          start: "top top",
          end: "+=400",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const progress = self.progress;

            // 计算J元素的缩放比例，使用缓动函数控制缩放速度
            const baseScale = 1;
            const maxScale = 50; // 设置最大缩放值，确保J元素能覆盖整个屏幕
            // 使用幂函数创建平缓的缩放曲线，控制J元素放大速度
            const scaleProgress = Math.pow(progress, 0.6); // 幂函数参数0.6用于减缓缩放速度
            const scale = baseScale + scaleProgress * (maxScale - baseScale);

            // 应用缩放变换到J元素
            gsap.set(jRef.current, {
              scale: scale,
              transformOrigin: "64% 60%", // 使用百分比精确控制原点：x轴25%匹配J的左侧位置，y轴50%保持垂直居中
            });

            // 隐藏背景层，让J元素本身实现屏幕覆盖效果
            gsap.set(jBackgroundRef.current, {
              opacity: 0, // 隐藏背景层
            });

            // 当J元素开始放大时，开始隐藏其他UI元素
            if (progress > 0.05) {
              // 副标题和底部按钮快速消失
              const fastHideProgress = Math.min((progress - 0.05) / 0.15, 1);
              const fastHideOpacity = 1 - fastHideProgress;
              gsap.set([subtitleRef.current, bottomLinksRef.current], {
                opacity: fastHideOpacity,
              });

              // 其他元素缓慢消失
              const slowHideProgress = Math.min((progress - 0.05) / 0.3, 1);
              const slowHideOpacity = 1 - slowHideProgress;
              gsap.set(
                [
                  spaceRef.current,
                  scrollIndicatorRef.current,
                  bottomDescriptionRef.current,
                ],
                { opacity: slowHideOpacity }
              );
            }

            // 当滚动接近完成时，准备显示IntroductionSection
            if (progress > 0.1) {
              const nextSection = document.querySelector(
                '[data-section="introduction"]'
              );
              if (nextSection) {
                gsap.set(nextSection, { zIndex: 60 });
                const showProgress = (progress - 0.1) / 0.9;
                gsap.set(nextSection, { opacity: showProgress });
              }
            }
          },
          onComplete: () => {
            const nextSection = document.querySelector(
              '[data-section="introduction"]'
            );
            if (nextSection) {
              gsap.set(nextSection, { zIndex: 60, opacity: 1 });
            }
          },
        });
      };

      /**
       * 鼠标视差效果处理函数
       * 仅在滚动进度较小时生效，避免与滚动动画冲突
       */
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xPos = (clientX / innerWidth - 0.5) * 8;
        const yPos = (clientY / innerHeight - 0.5) * 8;

        // 仅在滚动进度小于0.1时应用鼠标视差效果
        const scrollProgress =
          ScrollTrigger.getById("hero-scroll")?.progress || 0;
        if (scrollProgress < 0.1) {
          gsap.to(jRef.current, {
            x: xPos,
            y: yPos,
            duration: 0.8,
            ease: "power1.out",
          });
          gsap.to(spaceRef.current, {
            x: xPos * 0.8,
            y: yPos * 0.8,
            duration: 0.8,
            ease: "power1.out",
          });
        }
      };

      // 初始化滚动动画和鼠标事件监听
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
      {/* 背景渐变和环境光效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/3" />
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-primary/8 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-primary/4 rounded-full blur-3xl opacity-40" />
      </div>

      {/* J元素的扩展背景层 */}
      <div
        ref={jBackgroundRef}
        className="absolute inset-0 bg-primary opacity-0 pointer-events-none"
        style={{
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      />

      {/* 主要品牌标题 */}
      <div className="absolute inset-0 flex mt-14" style={{ zIndex: 50 }}>
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
          <span
            ref={jRef}
            className="italic text-primary mr-[0.1em] relative"
            style={{
              display: "inline-block",
              willChange: "transform",
              // 确保J元素在放大时能够覆盖副标题和按钮，但不覆盖导航栏
              position: "relative",
              zIndex: 50, // 设置z-index层级，确保在副标题和按钮之上
            }}
          >
            J
          </span>
          <span
            ref={spaceRef}
            className="text-black dark:text-white tracking-tighter"
          >
            SPACE
          </span>
        </h1>
      </div>

      {/* 右侧定位的副标题 */}
      <div className="absolute top-1/2 right-[5%]" style={{ zIndex: 10 }}>
        <h2
          ref={subtitleRef}
          className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-foreground/80 tracking-wider uppercase text-right"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 0 20px rgba(94, 116, 86, 0.2)",
            zIndex: 10, // 确保低于J元素的层级
          }}
        >
          {currentTexts.subtitle}
        </h2>
      </div>

      {/* 带动画线条的滚动指示器 */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-14 left-14 flex items-center space-x-4 h-14"
      >
        <div className="relative">
          <div className="w-0.5 h-12 bg-foreground/20" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-foreground/60 animate-pulse" />
        </div>
        <div className="flex flex-col text-foreground/60 text-base font-bold tracking-wider uppercase leading-tight space-y-1">
          <span>{currentTexts.scrollIndicator.scroll}</span>
          <span>{currentTexts.scrollIndicator.toExplore}</span>
        </div>
      </div>

      {/* 底部描述文本 */}
      <div
        ref={bottomDescriptionRef}
        className="absolute bottom-14 left-80 max-w-2xl px-8 flex items-center h-14"
      >
        <p className="text-foreground/60 text-sm md:text-base font-light leading-relaxed text-left">
          {currentTexts.description}
        </p>
      </div>

      {/* 底部操作链接 */}
      <div
        ref={bottomLinksRef}
        className="absolute bottom-14 right-14 flex flex-row space-x-4 items-center h-14"
        style={{ zIndex: 10 }}
      >
        {/* GitHub链接 */}
        <ActionLink
          href="https://github.com/your-username"
          icon="github"
          text={currentTexts.links.github}
        />

        {/* 支持链接 */}
        <ActionLink
          href="https://your-support-link.com"
          icon="heart"
          text={currentTexts.links.support}
        />
      </div>
    </section>
  );
}
