"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * 联系页面行动号召区域组件
 * 展示最终的联系邀请和行动按钮
 * @param {Object} texts - 本地化文本内容
 */
const ContactCTA = ({ texts }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const decorRef = useRef(null);

  useEffect(() => {
    const elements = {
      section: sectionRef.current,
      title: titleRef.current,
      subtitle: subtitleRef.current,
      button: buttonRef.current,
      decor: decorRef.current,
    };

    if (!elements.section) return;

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
      // 创建时间线
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: elements.section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // 装饰元素动画
      tl.fromTo(elements.decor,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.1, duration: 0.6, ease: "power2.out" }
      );

      // 标题动画
      tl.fromTo([elements.title, elements.subtitle],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.4"
      );

      // 按钮动画
      tl.fromTo(elements.button,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );

      // 按钮悬停效果
      if (elements.button) {
        const hoverConfig = { duration: 0.2, ease: "power2.out" };

        elements.button.addEventListener("mouseenter", () => {
          gsap.to(elements.button, {
            ...hoverConfig,
            scale: 1.05,
            boxShadow: "0 15px 35px rgba(94, 116, 86, 0.3)",
          });
        });

        elements.button.addEventListener("mouseleave", () => {
          gsap.to(elements.button, {
            ...hoverConfig,
            scale: 1,
            boxShadow: "0 8px 25px rgba(94, 116, 86, 0.2)",
          });
        });
      }

      // 装饰元素的持续动画
      if (elements.decor?.children) {
        Array.from(elements.decor.children).forEach((child, index) => {
          gsap.to(child, {
            rotation: index % 2 === 0 ? 360 : -360,
            duration: index % 2 === 0 ? 40 : 60,
            ease: "none",
            repeat: -1,
          });
        });
      }
    }, elements.section);

    return () => ctx.revert();
  }, []);

  const handleContactClick = () => {
    // 滚动到联系方式区域
    const contactSection = document.querySelector('[data-section="contact-methods"]');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // 如果没有找到联系方式区域，则打开邮箱
      window.location.href = 'mailto:chengyue.jin@outlook.com';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/10 overflow-hidden"
    >
      {/* 背景装饰 */}
      <div ref={decorRef} className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 主标题 */}
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
        >
          {texts.cta.title}
        </h2>

        {/* 副标题 */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl text-muted-foreground mb-12 leading-relaxed"
        >
          {texts.cta.subtitle}
        </p>

        {/* 行动按钮 */}
        <button
          ref={buttonRef}
          onClick={handleContactClick}
          className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 overflow-hidden border-2 border-primary"
        >
          {/* 悬停时的圆形遮光罩从左到右填充 */}
          <div className="absolute top-0 left-0 w-full h-full bg-background rounded-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
          
          {/* 按钮内容 */}
          <span className="relative z-10 flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
            {texts.cta.button}
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </button>

        {/* 底部文字 */}
        <div className="mt-12">
          <p className="text-muted-foreground/80 text-sm">
            {texts.footer.text}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
