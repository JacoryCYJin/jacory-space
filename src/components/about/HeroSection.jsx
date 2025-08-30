"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const HeroSection = ({ texts }) => {
  const heroRef = useRef(null);
  const avatarRef = useRef(null);
  const titleRef = useRef(null);
  const aspirationRef = useRef(null);
  const subtitleRef = useRef(null);
  const bioRef = useRef(null);
  const decorLineRef = useRef(null);
  const bgDecorRef = useRef(null);

  useEffect(() => {
    const elements = {
      hero: heroRef.current,
      avatar: avatarRef.current,
      title: titleRef.current,
      aspiration: aspirationRef.current,
      subtitle: subtitleRef.current,
      bio: bioRef.current,
      decorLine: decorLineRef.current,
      bgDecor: bgDecorRef.current,
    };

    if (!elements.hero) return;

    // 后备方案函数
    const ensureElementsVisible = () => {
      Object.values(elements)
        .filter(Boolean)
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
    };

    // 防止GSAP未加载的后备方案
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
        avatar: { scale: 0.95, opacity: 0.9 },
        bgDecor: { scale: 0.8, opacity: 0 },
      };

      // 创建时间线
      const tl = gsap.timeline({ defaults: ANIMATION_CONFIG.defaults });

      // 批量设置初始状态
      const { title, aspiration, subtitle, bio, decorLine, avatar, bgDecor } =
        elements;

      gsap.set(
        [title, aspiration, subtitle, bio],
        ANIMATION_CONFIG.textElements
      );
      gsap.set(decorLine, ANIMATION_CONFIG.decorLine);
      gsap.set(avatar, ANIMATION_CONFIG.avatar);
      gsap.set(bgDecor, ANIMATION_CONFIG.bgDecor);

      // 动画序列
      tl
        // 背景装饰先入场
        .to(bgDecor, {
          scale: 1,
          opacity: 0.2,
          duration: 1.0,
          ease: "power2.out",
        })
        // 头像动画
        .to(
          avatar,
          {
            scale: 1,
            opacity: 1,
            duration: 1.0,
            rotate: 10,
            ease: "back.out(1.2)",
          },
          "-=0.7"
        )
        // 标题动画 - 整体进入
        .to(
          title,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        )
        // 理想标签
        .to(
          aspiration,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        )
        // Slogan
        .to(
          subtitle,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          "-=0.4"
        )
        // 个人简介
        .to(
          bio,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          "-=0.4"
        )
        // 装饰线条优雅入场动画
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
        .to(
          decorLine,
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );

      // 头像悬停效果 - 使用GSAP Context管理
      if (avatar) {
        const hoverConfig = { duration: 0.4, ease: "power2.out" };

        avatar.addEventListener("mouseenter", () => {
          gsap.to(avatar, { ...hoverConfig, scale: 1.05, rotate: 0});
        });

        avatar.addEventListener("mouseleave", () => {
          gsap.to(avatar, { ...hoverConfig, scale: 1, rotate: 10 });
        });
      }

      // 背景装饰的持续动画
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

      // 装饰线条的闪烁效果
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
              repeatDelay: 6, // 每8秒重复一次 (2秒动画 + 6秒间隔)
            }
          );
        });
      }
    }, elements.hero); // GSAP Context范围

    return () => ctx.revert(); // 自动清理所有动画
  }, []);

  // 装饰线条的闪烁效果 - 移到主useEffect中避免重复逻辑
  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 极简背景装饰 */}
      <div ref={bgDecorRef} className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* 左右分栏布局 */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* 左侧 - 头像和视觉元素 */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-end w-full">
              <div className="relative">
                {/* 主头像 */}
                <div
                  ref={avatarRef}
                  className="w-68 h-68 sm:w-84 sm:h-84 lg:w-100 lg:h-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-4 border-primary/20 hover:border-primary/40 transition-colors overflow-hidden"
                >
                  <img
                    src="/images/avatar/avatar.jpg"
                    alt={texts.nickname}
                    className="w-full h-full object-fill"
                  />
                </div>
              </div>
            </div>

            {/* 右侧 - 文字内容 */}
            <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left w-full">
              {/* 标题 */}
              <div>
                <h1
                  ref={titleRef}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-foreground leading-tight tracking-tight"
                >
                  <span className="block font-bold">Hello,</span>
                  <span className="block text-primary font-bold">
                    I'm {texts.nickname}
                  </span>
                </h1>
              </div>

              {/* 理想标签 - 放在标题下方 */}
              <div className="flex justify-center lg:justify-start">
                <p
                  ref={aspirationRef}
                  className="text-base sm:text-lg text-primary/70 font-medium italic"
                >
                  {texts.aspiration}
                </p>
              </div>

              {/* Slogan */}
              <div>
                <p
                  ref={subtitleRef}
                  className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground leading-relaxed font-light"
                >
                  {texts.slogan}
                </p>
              </div>

              {/* 个人简介 */}
              <div>
                <p
                  ref={bioRef}
                  className="text-base sm:text-lg text-muted-foreground/80 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0"
                >
                  {texts.bio}
                </p>
              </div>

              {/* 装饰性分割线 */}
              <div className="flex justify-center lg:justify-start pt-4">
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
      </div>
    </section>
  );
};

export default HeroSection;
