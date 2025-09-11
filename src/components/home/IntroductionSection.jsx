"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";
import { introductionTexts } from "@/constants/home/IntroductionSection";

// 注册GSAP插件
// 确保在客户端环境中正确注册ScrollTrigger插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * 介绍区域组件
 *
 * 这是首页的第二个主要区域，与HeroSection配合实现流畅的滚动过渡效果。
 * 主要功能包括：
 * - 与HeroSection的滚动交互协调
 * - 展示网站核心功能特性
 * - 提供行动号召按钮
 * - 响应式布局设计
 * - 多语言内容支持
 *
 * @returns {JSX.Element} 渲染的介绍区域组件
 */
export default function IntroductionSection() {
  const { language } = useApp();
  const currentTexts = introductionTexts[language];

  // 动画目标元素的引用
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // 设置初始状态：整个section隐藏，所有子元素隐藏
      gsap.set(sectionRef.current, {
        opacity: 0,
        zIndex: 60, // 设置z-index层级，确保在J元素之上
      });

      gsap.set([
        titleRef.current,
        subtitleRef.current,
        descriptionRef.current,
        featuresRef.current,
        ctaRef.current,
      ], {
        opacity: 0,
        y: 50,
      });

      // 等待HeroSection的滚动触发器完成后再显示内容
      let contentShown = false;
      const checkHeroProgress = () => {
        const heroTrigger = ScrollTrigger.getById("hero-scroll");
        if (heroTrigger && heroTrigger.progress >= 0.9 && !contentShown) {
          contentShown = true;
          // HeroSection滚动接近完成，开始显示IntroductionSection内容
          const tl = gsap.timeline();
          const fadeInConfig = { opacity: 1, y: 0, ease: "power2.out" };

          tl.to(titleRef.current, { ...fadeInConfig, duration: 1.2 })
            .to(subtitleRef.current, { ...fadeInConfig, duration: 1 }, "-=0.6")
            .to(descriptionRef.current, { ...fadeInConfig, duration: 1 }, "-=0.4")
            .to(featuresRef.current, { ...fadeInConfig, duration: 1 }, "-=0.4")
            .to(ctaRef.current, { ...fadeInConfig, duration: 0.8 }, "-=0.3");
        }
      };

      // 定期检查HeroSection的滚动进度
      const progressInterval = setInterval(checkHeroProgress, 50);

      return () => {
        clearInterval(progressInterval);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="introduction"
      className="relative min-h-screen flex flex-col items-center justify-center bg-primary text-primary-foreground overflow-hidden"
    >
      {/* 背景光效 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/3 rounded-full blur-3xl" />
      </div>

      {/* 内容容器 */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        {/* 主标题 */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
          }}
        >
          {currentTexts.title}
        </h1>

        {/* 副标题 */}
        <h2
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl font-medium mb-8 text-primary-foreground/90"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {currentTexts.subtitle}
        </h2>

        {/* 描述文本 */}
        <p
          ref={descriptionRef}
          className="text-lg md:text-xl mb-16 max-w-4xl mx-auto leading-relaxed text-primary-foreground/80"
        >
          {currentTexts.description}
        </p>

        {/* 功能特性网格 */}
        <div
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {currentTexts.features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-foreground">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* 行动号召按钮 */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="group bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-foreground/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            {currentTexts.cta.text}
          </button>
          <button className="group border-2 border-white/30 text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:border-white/50 hover:bg-white/10 transition-all duration-300">
            {currentTexts.cta.action}
          </button>
        </div>
      </div>
    </section>
  );
}
