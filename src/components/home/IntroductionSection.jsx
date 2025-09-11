/**
 * 介绍区域组件 - 首页核心展示区域
 * 作者：JacoryJin
 */
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";
import { introductionTexts } from "@/constants/home/IntroductionSection";
import { introductionCards } from "@/constants/home/IntroductionCard/cards";
import IntroductionCard from "@/components/home/IntroductionCard";

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
  const currentTexts = introductionTexts[language];
  const currentCards = introductionCards[language];

  // 所有需要动画的元素引用
  const sectionRef = useRef(null);
  const leftContentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
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
        [
          titleRef.current,
          subtitleRef.current,
          descriptionRef.current,
          ctaRef.current,
        ],
        {
          opacity: 0,
          x: -100,
        }
      );

      // 卡片初始状态：隐藏在右下角，准备依次滑入
      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          gsap.set(cardRef, {
            opacity: 0,
            x: 400 + index * 40, // 每个卡片稍微错开位置
            y: 300 + index * 15,
            scale: 0.7,
            rotation: 10 + index * 3, // 每个卡片不同的旋转角度
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
        .to(
          ctaRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
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

              // 响应式层叠位置计算
              const getStackOffset = () => {
                if (window.innerWidth < 640) return index * 70; // sm: 小屏
                if (window.innerWidth < 768) return index * 87; // md: 中屏
                if (window.innerWidth < 1024) return index * 105; // lg: 大屏
                if (window.innerWidth < 1280) return index * 122; // xl: 超大屏
                return index * 140; // 2xl: 更大屏幕
              };
              const stackOffset = getStackOffset();
              const finalX = stackOffset;
              const finalY = stackOffset * 0.9;

              // 从右下角滑动到最终层叠位置的插值计算
              const currentOpacity = gsap.utils.interpolate(0, 1, cardProgress);
              const getStartX = () => {
                if (window.innerWidth < 640) return 260 + index * 18; // sm: 小屏
                if (window.innerWidth < 768) return 350 + index * 22; // md: 中屏
                if (window.innerWidth < 1024) return 395 + index * 26; // lg: 大屏
                if (window.innerWidth < 1280) return 435 + index * 26; // xl: 超大屏
                return 525 + index * 30; // 2xl: 更大屏幕
              };
              const currentX = gsap.utils.interpolate(
                getStartX(),
                finalX,
                cardProgress
              );
              const getStartY = () => {
                if (window.innerWidth < 640) return 130 + index * 13; // sm: 小屏
                if (window.innerWidth < 768) return 157 + index * 16; // md: 中屏
                if (window.innerWidth < 1024) return 175 + index * 17; // lg: 大屏
                if (window.innerWidth < 1280) return 175 + index * 17; // xl: 超大屏
                return 192 + index * 19; // 2xl: 更大屏幕
              };
              const currentY = gsap.utils.interpolate(
                getStartY(),
                finalY,
                cardProgress
              );
              const currentScale = gsap.utils.interpolate(0.8, 1, cardProgress);
              const currentRotation = gsap.utils.interpolate(
                -15 + index * 3,
                0,
                cardProgress
              );

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

                // 每个卡片独立的悬浮参数
                const floatY = gsap.utils.random(-4, 4);
                const floatRotation = gsap.utils.random(-1, 1);
                const duration = gsap.utils.random(4, 6);

                gsap.to(cardRef, {
                  y: `+=${floatY}`,
                  rotation: `+=${floatRotation}`,
                  duration: duration,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                  delay: index * 0.2,
                });
              }
            });
          }
        },
        onComplete: () => {
          // 卡片动画完成，Section解除固定状态
          console.log("卡片动画序列完成，Section解除固定");
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
        <div
          ref={leftContentRef}
          className="col-span-2 flex flex-col justify-center space-y-8"
        >
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
            <IntroductionCard
              key={card.id}
              ref={(el) => (cardRefs.current[index] = el)}
              number={card.number}
              title={card.title}
              subtitle={card.subtitle}
              color={card.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
