"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 设计创作技能卡片组件
 * 展示设计和创作相关的技能和项目
 * @param {Array} skills - 技能名称数组
 * @param {string} language - 当前语言设置
 * @param {Object} cardData - 卡片配置数据
 */
const DesignCard = ({ skills, language, cardData }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 初始化动画状态
      gsap.set(".design-header", { opacity: 0, y: 20 });
      gsap.set(".design-skills", { opacity: 0, y: 20 });
      gsap.set(".design-projects", { opacity: 0, y: 20 });
      gsap.set(".design-skill-tag", { opacity: 0, scale: 0, rotate: 180 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // 顺序动画时间线
      tl.to(".design-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0)
      .to(".design-skills", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.2)
      .to(".design-projects", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.4);

      // 技能标签错开动画
      skills.forEach((_, index) => {
        tl.to(`.design-skill-tag:nth-child(${index + 1})`, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: "back.out(1.7)"
        }, 0.6 + index * 0.1);
      });

    }, cardRef);

    return () => ctx.revert();
  }, [skills]);

  return (
    <div ref={cardRef} className="w-full h-full flex items-center justify-center p-3">
      <div className="w-full mx-auto">
        <div className="design-header text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
            <span className="text-xl">🎨</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold mb-3 text-foreground">
            {cardData?.title || (language === 'en' ? 'Design & Creation' : language === 'zh-tw' ? '設計創作' : '设计创作')}
          </h3>
          <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {cardData?.description || (language === 'en' ? 'Focusing on visual design and creative expression to build unique brand identities' : language === 'zh-tw' ? '專注於視覺設計和創意表達，打造獨特的品牌形象' : '专注于视觉设计和创意表达，打造独特的品牌形象')}
          </p>
        </div>

        <div className="design-skills mb-6">
          <h4 className="text-base lg:text-lg font-semibold text-foreground mb-4 text-center">
            {language === 'en' ? 'Technologies' : '技术栈'}
          </h4>
          <div className="flex flex-wrap gap-1.5 lg:gap-2 justify-center">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="design-skill-tag px-2.5 lg:px-3 py-1 lg:py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="design-projects space-y-4">
          <h4 className="text-base lg:text-lg font-semibold text-foreground text-center">
            {language === 'en' ? 'Featured Projects' : '精选项目'}
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div className="bg-card/50 border border-border/50 rounded-lg p-3 lg:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                <h5 className="font-semibold text-foreground text-xs lg:text-sm">
                  {cardData?.projects?.[0]?.title || (language === 'en' ? 'Brand Identity Design' : '品牌形象设计')}
                </h5>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cardData?.projects?.[0]?.description || (language === 'en' ? 'Complete brand identity package including logo, colors, and guidelines' : '完整的品牌形象包，包括标志、色彩和设计规范')}
              </p>
            </div>

            <div className="bg-card/50 border border-border/50 rounded-lg p-3 lg:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                <h5 className="font-semibold text-foreground text-xs lg:text-sm">
                  {cardData?.projects?.[1]?.title || (language === 'en' ? 'UI/UX Design System' : 'UI/UX设计系统')}
                </h5>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cardData?.projects?.[1]?.description || (language === 'en' ? 'Comprehensive design system for mobile and web applications' : '面向移动端和网页应用的全面设计系统')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
