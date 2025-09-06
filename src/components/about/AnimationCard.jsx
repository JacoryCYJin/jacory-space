"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 动画交互技能卡片组件
 * 展示动画和交互相关的技能和项目
 * @param {Array} skills - 技能名称数组
 * @param {string} language - 当前语言设置
 * @param {Object} cardData - 卡片配置数据
 */
const AnimationCard = ({ skills, language, cardData }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 初始化动画状态
      gsap.set(".animation-header", { opacity: 0, y: 20 });
      gsap.set(".animation-skills", { opacity: 0, y: 20 });
      gsap.set(".animation-projects", { opacity: 0, y: 20 });
      gsap.set(".animation-skill-tag", { opacity: 0, scale: 0, rotate: 180 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // 顺序动画时间线
      tl.to(".animation-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0)
      .to(".animation-skills", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.2)
      .to(".animation-projects", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.4);

      // 技能标签错开动画
      skills.forEach((_, index) => {
        tl.to(`.animation-skill-tag:nth-child(${index + 1})`, {
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
        <div className="animation-header text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-3">
            <span className="text-xl">✨</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-bold mb-3 text-foreground">
            {cardData?.title || (language === 'en' ? 'Animation & Interaction' : language === 'zh-tw' ? '動畫互動' : '动画交互')}
          </h3>
          <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {cardData?.description || (language === 'en' ? 'Focusing on creating smooth animations and interactive experiences' : language === 'zh-tw' ? '專注於創建流暢的動畫效果和互動體驗' : '专注于创建流畅的动画效果和交互体验')}
          </p>
        </div>

        <div className="animation-skills mb-6">
          <h4 className="text-base lg:text-lg font-semibold text-foreground mb-4 text-center">
            {language === 'en' ? 'Technologies' : '技术栈'}
          </h4>
          <div className="flex flex-wrap gap-1.5 lg:gap-2 justify-center">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="animation-skill-tag px-2.5 lg:px-3 py-1 lg:py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="animation-projects space-y-4">
          <h4 className="text-base lg:text-lg font-semibold text-foreground text-center">
            {language === 'en' ? 'Featured Projects' : '精选项目'}
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div className="bg-card/50 border border-border/50 rounded-lg p-3 lg:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                <h5 className="font-semibold text-foreground text-xs lg:text-sm">
                  {cardData?.projects?.[0]?.title || (language === 'en' ? 'Interactive Dashboard' : '交互式仪表板')}
                </h5>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cardData?.projects?.[0]?.description || (language === 'en' ? 'Real-time data visualization with smooth animations' : '具有流畅动画效果的实时数据可视化')}
              </p>
            </div>

            <div className="bg-card/50 border border-border/50 rounded-lg p-3 lg:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                <h5 className="font-semibold text-foreground text-xs lg:text-sm">
                  {cardData?.projects?.[1]?.title || (language === 'en' ? 'Game UI Animations' : '游戏界面动画')}
                </h5>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cardData?.projects?.[1]?.description || (language === 'en' ? 'Mobile game interface with engaging micro-interactions' : '具有吸引人微交互的移动游戏界面')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationCard;
