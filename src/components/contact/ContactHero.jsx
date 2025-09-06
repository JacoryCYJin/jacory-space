"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * 联系页面英雄区域组件
 * 展示页面标题、副标题和描述，包含丰富的入场动画
 * @param {Object} texts - 本地化文本内容
 */
const ContactHero = ({ texts }) => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const decorLineRef = useRef(null);
  const bgDecorRef = useRef(null);

  useEffect(() => {
    const elements = {
      hero: heroRef.current,
      title: titleRef.current,
      subtitle: subtitleRef.current,
      description: descriptionRef.current,
      decorLine: decorLineRef.current,
      bgDecor: bgDecorRef.current,
    };

    if (!elements.hero) return;

    // GSAP加载失败时的后备方案
    const ensureElementsVisible = () => {
      Object.values(elements)
        .filter(Boolean)
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
    };

    // 检查GSAP是否加载，未加载时使用后备方案
    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded, ensuring all elements are visible");
      ensureElementsVisible();
      return;
    }

    // 使用GSAP Context API进行更好的内存管理
    const ctx = gsap.context(() => {
      // 动画配置常量
      const ANIMATION_CONFIG = {
        defaults: { ease: "power2.out", duration: 0.8 },
        textElements: { y: 30, opacity: 0 },
        decorLine: {
          y: 20,
          opacity: 0,
          scaleX: 0,
          transformOrigin: "left center",
        },
        bgDecor: { scale: 0.8, opacity: 0 },
      };

      // 创建主动画时间线
      const tl = gsap.timeline({ defaults: ANIMATION_CONFIG.defaults });

      // 解构元素引用
      const { title, subtitle, description, decorLine, bgDecor } = elements;

      // 批量设置元素初始状态
      gsap.set([title, subtitle, description], ANIMATION_CONFIG.textElements);
      gsap.set(decorLine, ANIMATION_CONFIG.decorLine);
      gsap.set(bgDecor, ANIMATION_CONFIG.bgDecor);

      // 主动画序列
      tl
        // 背景装饰光效入场
        .to(bgDecor, {
          scale: 1,
          opacity: 0.15,
          duration: 1.0,
          ease: "power2.out",
        })
        // 主标题文字入场
        .to(
          title,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.7"
        )
        // 副标题入场
        .to(
          subtitle,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // 描述文字入场
        .to(
          description,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          "-=0.4"
        )
        // 装饰线条入场动画
        .to(
          decorLine,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        )
        // 装饰线条展开动画
        .to(
          decorLine,
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // 背景装饰元素的持续旋转动画
      if (bgDecor?.children) {
        const bgChildren = Array.from(bgDecor.children);
        bgChildren.forEach((child, index) => {
          gsap.to(child, {
            rotation: index % 2 === 0 ? 360 : -360,
            duration: index % 2 === 0 ? 60 : 80,
            ease: "none",
            repeat: -1,
          });
        });
      }

      // 装饰线条的流光效果
      if (decorLine) {
        gsap.delayedCall(3, () => {
          gsap.fromTo(
            decorLine,
            { backgroundPosition: "-200px 0" },
            {
              backgroundPosition: "200px 0",
              duration: 2,
              ease: "power2.inOut",
              repeat: -1,
              repeatDelay: 6,
            }
          );
        });
      }
    }, elements.hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 背景装饰光效 */}
      <div ref={bgDecorRef} className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-8">
            {/* 主标题 */}
            <div>
              <h1
                ref={titleRef}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-foreground leading-tight tracking-tight"
              >
                <span className="block font-bold text-primary">
                  {texts.title}
                </span>
              </h1>
            </div>

            {/* 副标题 */}
            <div>
              <p
                ref={subtitleRef}
                className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground leading-relaxed font-light"
              >
                {texts.subtitle}
              </p>
            </div>

            {/* 描述文字 */}
            <div>
              <p
                ref={descriptionRef}
                className="text-base sm:text-lg text-muted-foreground/80 leading-relaxed font-light max-w-4xl mx-auto"
              >
                {texts.description}
              </p>
            </div>

            {/* 装饰性分割线 */}
            <div className="flex justify-center pt-8">
              <div
                ref={decorLineRef}
                className="w-20 h-1 rounded-full relative"
                style={{
                  background: "#5E7456",
                  height: "4px",
                  boxShadow: "0 2px 4px rgba(94, 116, 86, 0.3)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
