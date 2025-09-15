/**
 * 介绍区域组件 - 首页核心展示区域
 * 作者：JacoryJin
 */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";
import { featureTexts } from "@/constants/home/FeatureSection";
import { featureCards } from "@/constants/home/FeatureCard";
import FeatureCard from "@/components/home/FeatureCard";

// 确保ScrollTrigger插件在客户端正确注册
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * 介绍区域组件
 *
 * 左2右4网格布局，配合GSAP滚动动画：
 * - 左侧：博客介绍文字内容
 * - 右侧：卡片从右下角出现，最终排列从左上角01到右下角04
 * - 支持多语言切换
 *
 * @returns {JSX.Element} 渲染的介绍区域
 */
export default function IntroductionSection() {
  const { language } = useApp();
  const currentTexts = featureTexts[language];
  const currentCards = featureCards[language];

  // 动画元素引用
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // 设置Section初始状态和层级
      gsap.set(sectionRef.current, {
        opacity: 1,
        zIndex: 60,
      });

      // 右上角文字内容初始隐藏状态
      gsap.set([titleRef.current, subtitleRef.current], {
        opacity: 0,
        x: 100,
        y: -50,
      });

      // 卡片初始状态：隐藏在右下角，准备向左上角到右下角的最终位置展开
      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          // 计算每张卡片的初始位置（从右下角开始出现）
          const baseX = window.innerWidth + 100; // 从右侧屏幕外开始
          const baseY = window.innerHeight + 100; // 从底部屏幕外开始

          gsap.set(cardRef, {
            opacity: 0,
            x: baseX + index * 20, // 向右偏移
            y: baseY + index * 20, // 向下偏移
            scale: 0.6,
            rotation: 0, // 移除旋转
            zIndex: 10 - index, // 层级递减，第一张在最上层
          });
        }
      });

      // 第一阶段：左侧文字内容入场动画
      const initialTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      // 右上角文字依次显示
      initialTl
        .to(titleRef.current, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        );

      // 第二阶段：固定Section，执行卡片序列动画
      const cardAnimationDistance = window.innerHeight * 3;

      const pinScrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${cardAnimationDistance}`,
        pin: true,
        anticipatePin: 1,
        // markers: true, // 调试时启用
        onUpdate: (self) => {
          const progress = self.progress;
          const totalCards = cardRefs.current.length;

          // 计算每个卡片的入场时机和动画进度
          cardRefs.current.forEach((cardRef, index) => {
            if (cardRef) {
              // 卡片动画时机：10%-80%区间内依次入场
              const cardStartProgress = (index / totalCards) * 0.7 + 0.1;
              const cardDuration = 0.25;
              const cardEndProgress = Math.min(
                cardStartProgress + cardDuration,
                0.9
              );

              let cardProgress = 0;
              if (progress >= cardStartProgress) {
                if (progress <= cardEndProgress) {
                  // 计算当前卡片的动画进度，应用缓动效果
                  const rawProgress =
                    (progress - cardStartProgress) / cardDuration;
                  cardProgress = gsap.utils.interpolate(
                    0,
                    1,
                    gsap.parseEase("power2.out")(rawProgress)
                  );
                } else {
                  cardProgress = 1;
                }
              }

              // 响应式位置计算 - 从右下角出现，最终排列从左上角到右下角
              const getResponsiveValues = () => {
                const width = window.innerWidth;
                const height = window.innerHeight;

                // 初始位置（右下角屏幕外）
                const startX = width + 100 + index * 20;
                const startY = height + 100 + index * 20;

                // 最终位置（从左上角01到右下角04的排列）
                let finalX, finalY;

                if (width < 640) {
                  // 手机屏：紧凑排列
                  finalX = index * 120;
                  finalY = index * 70;
                } else if (width < 768) {
                  // 平板屏
                  finalX = index * 150;
                  finalY = index * 80;
                } else if (width < 1024) {
                  // 小桌面
                  finalX = index * 180;
                  finalY = index * 90;
                } else if (width < 1280) {
                  // 中桌面
                  finalX = index * 220;
                  finalY = index * 100;
                } else {
                  // 大桌面
                  finalX = index * 250;
                  finalY = index * 110;
                }

                return { startX, startY, finalX, finalY };
              };

              const { startX, startY, finalX, finalY } = getResponsiveValues();

              // 插值计算
              const currentOpacity = gsap.utils.interpolate(0, 1, cardProgress);
              const currentX = gsap.utils.interpolate(
                startX,
                finalX,
                cardProgress
              );
              const currentY = gsap.utils.interpolate(
                startY,
                finalY,
                cardProgress
              );
              const currentScale = gsap.utils.interpolate(0.6, 1, cardProgress);
              const currentRotation = 0; // 移除所有旋转效果

              gsap.set(cardRef, {
                opacity: currentOpacity,
                x: currentX,
                y: currentY,
                scale: currentScale,
                rotation: currentRotation,
                zIndex: index + 1, // 后面的卡片在上层
              });
            }
          });
        },
      });

      // 第三阶段：解除固定后恢复正常滚动
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="introduction"
      className="relative min-h-screen bg-primary text-primary-foreground overflow-hidden"
    >
      {/* 装饰性背景光效 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/3 rounded-full blur-3xl" />
      </div>

      {/* 主要内容容器：全屏布局 */}
      <div className="relative z-10 min-h-screen mx-auto pt-14">
        {/* 右上角标题区域 */}
        <div className="absolute top-32 right-14 z-20 text-right">
          {/* 博客主标题 */}
          <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 text-right whitespace-nowrap"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {currentTexts.title}
          </h1>

          {/* 博客副标题 */}
          <h2
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-primary-foreground/60 mb-6 text-right leading-relaxed"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {currentTexts.subtitle}
          </h2>
        </div>

        {/* 卡片展示区域 - 从右下角出现，最终排列从左上角01到右下角04 */}
        <div ref={cardsContainerRef} className="relative w-full h-screen">
          {currentCards.map((card, index) => (
            <FeatureCard
              key={card.id}
              ref={(el) => (cardRefs.current[index] = el)}
              number={card.number}
              title={card.title}
              subtitle={card.subtitle}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
