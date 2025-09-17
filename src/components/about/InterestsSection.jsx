"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 兴趣爱好展示组件
 * 展示个人兴趣爱好标签
 * @param {Object} texts - 本地化文本内容
 */
const InterestsSection = ({ texts }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const interestsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 标题区域弹性入场动画
      gsap.fromTo(
        titleRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 兴趣爱好标签旋转入场动画
      interestsRef.current.forEach((interest, index) => {
        if (interest) {
          gsap.fromTo(
            interest,
            {
              scale: 0,
              rotation: 180,
              opacity: 0,
            },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.8,
              ease: "back.out(1.7)",
              delay: index * 0.1,
              scrollTrigger: {
                trigger: interest,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /**
   * 兴趣爱好标签组件
   * @param {string} interest - 兴趣爱好名称
   * @param {number} index - 标签索引
   */
  const InterestTag = ({ interest, index }) => (
    <span
      ref={(el) => (interestsRef.current[index] = el)}
      className="group relative px-6 py-3 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-800 dark:text-green-200 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:-rotate-2 overflow-hidden"
    >
      <span className="relative z-10">{interest}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400/30 rounded-full animate-ping group-hover:animate-none" />
    </span>
  );

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden h-screen">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* 兴趣爱好展示区域 */}
          <div className="w-full max-w-3xl text-center">
            <div ref={titleRef} className="mb-12">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span className="text-primary font-medium tracking-wider uppercase text-sm">
                  个人兴趣
                </span>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  {texts.sections.interests}
                </span>
              </h2>

              <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-6 mx-auto" />

              <p className="text-lg text-muted-foreground leading-relaxed">
                工作之余的热情所在，生活中的美好追求
              </p>
            </div>

            {/* 兴趣爱好标签列表 */}
            <div className="flex flex-wrap gap-4 justify-center">
              {texts.interests.map((interest, index) => (
                <InterestTag key={index} interest={interest} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterestsSection;
