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
 * - 右侧：卡片从右下角依次滑入并层叠排列
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
  const descriptionRef = useRef(null);
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

      // 左侧文字内容初始隐藏状态
      gsap.set(
        [titleRef.current, subtitleRef.current, descriptionRef.current],
        { opacity: 0, x: -100 }
      );

      // 卡片初始状态：隐藏在右下角，准备依次滑入
      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          gsap.set(cardRef, {
            opacity: 0,
            x: 400 + index * 40,
            y: 300 + index * 15,
            scale: 0.7,
            rotation: 10 + index * 3,
            zIndex: index + 1,
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

      // 左侧文字依次显示
      initialTl
        .to(titleRef.current, {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .to(
          descriptionRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6"
        )

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

              // 响应式位置计算
              const getResponsiveValues = () => {
                const width = window.innerWidth;
                if (width < 640) return { stackOffset: index * 70, startX: 260 + index * 18, startY: 130 + index * 13 };
                if (width < 768) return { stackOffset: index * 87, startX: 350 + index * 22, startY: 157 + index * 16 };
                if (width < 1024) return { stackOffset: index * 105, startX: 395 + index * 26, startY: 175 + index * 17 };
                if (width < 1280) return { stackOffset: index * 122, startX: 435 + index * 26, startY: 175 + index * 17 };
                return { stackOffset: index * 140, startX: 525 + index * 30, startY: 192 + index * 19 };
              };
              
              const { stackOffset, startX, startY } = getResponsiveValues();
              const finalX = stackOffset;
              const finalY = stackOffset * 0.9;

              // 插值计算
              const currentOpacity = gsap.utils.interpolate(0, 1, cardProgress);
              const currentX = gsap.utils.interpolate(startX, finalX, cardProgress);
              const currentY = gsap.utils.interpolate(startY, finalY, cardProgress);
              const currentScale = gsap.utils.interpolate(0.8, 1, cardProgress);
              const currentRotation = gsap.utils.interpolate(-15 + index * 3, 0, cardProgress);

              gsap.set(cardRef, {
                opacity: currentOpacity,
                x: currentX,
                y: currentY,
                scale: currentScale,
                rotation: currentRotation,
                zIndex: index + 1,
              });
            }
          });

          // 所有卡片入场完成后，添加微妙的悬浮动画
          if (progress > 0.85) {
            cardRefs.current.forEach((cardRef, index) => {
              if (cardRef && !cardRef.hasFloatingAnimation) {
                cardRef.hasFloatingAnimation = true;

                gsap.to(cardRef, {
                  y: `+=${gsap.utils.random(-4, 4)}`,
                  rotation: `+=${gsap.utils.random(-1, 1)}`,
                  duration: gsap.utils.random(4, 6),
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                  delay: index * 0.2,
                });
              }
            });
          }
        },
      });

      // 第三阶段：解除固定后恢复正常滚动
    }, sectionRef);

    return () => {
      ctx.revert();
      // 清理动画状态标记
      cardRefs.current.forEach((cardRef) => {
        if (cardRef) {
          cardRef.hasFloatingAnimation = false;
        }
      });
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

      {/* 主要内容容器：左2右4网格布局 */}
      <div className="relative z-10 min-h-screen grid grid-cols-6 gap-8 max-w-7.5xl mx-auto pt-14">
        {/* 左侧文字内容区域 */}
        <div className="col-span-2 flex flex-col justify-center space-y-8">
          {/* 博客主标题 */}
          <h1
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
            }}
          >
            {currentTexts.title}
          </h1>

          {/* 博客副标题 */}
          <h2
            ref={subtitleRef}
            className="text-lg md:text-xl lg:text-2xl font-medium text-primary-foreground/90"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {currentTexts.subtitle}
          </h2>

          {/* 博客描述 */}
          <p
            ref={descriptionRef}
            className="text-base md:text-lg leading-relaxed text-primary-foreground/80"
          >
            {currentTexts.description}
          </p>
        </div>

        {/* 右侧卡片展示区域 */}
        <div ref={cardsContainerRef} className="col-span-4 relative">
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
