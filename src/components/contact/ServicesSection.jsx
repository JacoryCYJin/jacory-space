"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * 服务介绍区域组件
 * 展示提供的各种技术服务，包含卡片动画效果
 * @param {Object} texts - 本地化文本内容
 */
const ServicesSection = ({ texts }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const elements = {
      section: sectionRef.current,
      title: titleRef.current,
      subtitle: subtitleRef.current,
      cards: cardsRef.current,
    };

    if (!elements.section) return;

    // GSAP加载失败时的后备方案
    const ensureElementsVisible = () => {
      Object.values(elements)
        .filter(Boolean)
        .forEach((el) => {
          if (Array.isArray(el)) {
            el.forEach((card) => {
              if (card) {
                card.style.opacity = "1";
                card.style.transform = "none";
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
      // 设置初始状态
      gsap.set([elements.title, elements.subtitle], {
        y: 50,
        opacity: 0,
      });

      gsap.set(elements.cards, {
        y: 80,
        opacity: 0,
        scale: 0.95,
      });

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
      tl.to([elements.title, elements.subtitle], {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
      });

      // 卡片动画
      tl.to(
        elements.cards,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.2)",
          stagger: 0.15,
        },
        "-=0.4"
      );

      // 卡片悬停效果
      elements.cards.forEach((card) => {
        if (card) {
          const hoverConfig = { duration: 0.3, ease: "power2.out" };

          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              ...hoverConfig,
              y: -10,
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(94, 116, 86, 0.15)",
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              ...hoverConfig,
              y: 0,
              scale: 1,
              boxShadow: "0 10px 30px rgba(94, 116, 86, 0.1)",
            });
          });
        }
      });
    }, elements.section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-7xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            {texts.services.title}
          </h2>
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            {texts.services.subtitle}
          </p>
        </div>

        {/* 服务卡片网格 */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {texts.services.items.map((service, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-80 flex flex-col"
            >
              {/* 背景装饰 - 根据卡片位置调整 */}
              <div
                className={`absolute w-32 h-32 bg-primary/5 rounded-full group-hover:scale-110 transition-transform duration-500 ${
                  index === 0
                    ? "bottom-0 right-0 translate-y-16 translate-x-16" // 左上角卡片 -> 右下角
                    : index === 1
                    ? "bottom-0 left-0 translate-y-16 -translate-x-16" // 右上角卡片 -> 左下角
                    : index === 2
                    ? "top-0 right-0 -translate-y-16 translate-x-16" // 左下角卡片 -> 右上角
                    : "top-0 left-0 -translate-y-16 -translate-x-16" // 右下角卡片 -> 左上角
                }`}
              ></div>

              {/* 内容区域 - 根据卡片位置调整对齐方式 */}
              <div className={`flex-1 flex flex-col ${
                index === 0 ? 'items-start text-left justify-start' : // 左上角卡片 - 左对齐，顶部
                index === 1 ? 'items-end text-right justify-start' : // 右上角卡片 - 右对齐，顶部
                index === 2 ? 'items-start text-left justify-end' : // 左下角卡片 - 左对齐，底部
                'items-end text-right justify-end' // 右下角卡片 - 右对齐，底部
              }`}>
                {/* 图标 */}
                <div className="text-4xl mb-6">{service.icon}</div>

                {/* 标题 */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>

                {/* 描述 */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* 技术栈标签 */}
                <div className={`flex flex-wrap gap-2 ${
                  index === 0 || index === 2 ? 'justify-start' : 'justify-end'
                }`}>
                  {service.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 悬停时的装饰线 */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 ease-out"></div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
