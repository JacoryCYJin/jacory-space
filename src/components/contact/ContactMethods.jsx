"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ContactIcons } from "../../constants/Contact";

/**
 * 联系方式区域组件
 * 展示各种联系方式，包含交互效果
 * @param {Object} texts - 本地化文本内容
 */
const ContactMethods = ({ texts }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const methodsRef = useRef([]);

  useEffect(() => {
    const elements = {
      section: sectionRef.current,
      title: titleRef.current,
      subtitle: subtitleRef.current,
      methods: methodsRef.current,
    };

    if (!elements.section) return;

    // GSAP加载失败时的后备方案
    const ensureElementsVisible = () => {
      Object.values(elements)
        .filter(Boolean)
        .forEach((el) => {
          if (Array.isArray(el)) {
            el.forEach((method) => {
              if (method) {
                method.style.opacity = "1";
                method.style.transform = "none";
              }
            });
          } else {
            el.style.opacity = "1";
            el.style.transform = "none";
          }
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

      // 标题动画
      tl.fromTo(
        [elements.title, elements.subtitle],
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 }
      );

      // 联系方式卡片动画
      tl.fromTo(
        elements.methods,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.2)",
          stagger: 0.08,
        },
        "-=0.3"
      );

      // 卡片悬停效果
      elements.methods.forEach((method) => {
        if (method) {
          const hoverConfig = { duration: 0.2, ease: "power2.out" };

          method.addEventListener("mouseenter", () => {
            gsap.to(method, {
              ...hoverConfig,
              y: -8,
              scale: 1.03,
              boxShadow: "0 15px 35px rgba(94, 116, 86, 0.2)",
            });
          });

          method.addEventListener("mouseleave", () => {
            gsap.to(method, {
              ...hoverConfig,
              y: 0,
              scale: 1,
              boxShadow: "0 8px 25px rgba(94, 116, 86, 0.1)",
            });
          });
        }
      });
    }, elements.section);

    return () => ctx.revert();
  }, []);

  const handleContactClick = (action) => {
    if (action.startsWith("mailto:")) {
      window.location.href = action;
    } else if (action.startsWith("weixin://")) {
      // 微信联系的处理逻辑
      alert("请添加微信：jacory_space");
    } else {
      window.open(action, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      ref={sectionRef}
      data-section="contact-methods"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            {texts.contact.title}
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            {texts.contact.subtitle}
          </p>
        </div>

        {/* 联系方式网格 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {texts.contact.methods.map((method, index) => (
            <div
              key={index}
              ref={(el) => (methodsRef.current[index] = el)}
              onClick={() => handleContactClick(method.action)}
              className="group relative bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* 背景装饰 */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>

              {/* 图标 */}
              <div className="text-3xl text-primary mb-4 group-hover:scale-110 transition-transform duration-300 transform-gpu origin-center inline-block w-fit flex items-center justify-center">
                {ContactIcons[method.iconName]}
              </div>

              {/* 标题 */}
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {method.title}
              </h3>

              {/* 联系方式值 */}
              <p className="text-primary font-medium mb-3 group-hover:text-primary/80 transition-colors duration-300">
                {method.value}
              </p>

              {/* 描述 */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {method.description}
              </p>

              {/* 悬停时的装饰线 */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 ease-out"></div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">💡 {texts.contact.hint}</p>
        </div>
      </div>
    </section>
  );
};

export default ContactMethods;
