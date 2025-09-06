"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrbitingCircles } from "../magicui/orbiting-circles";
import {
  techIcons,
  skillsStackLabels,
} from "../../constants/about/SkillLibrary";

gsap.registerPlugin(ScrollTrigger);

/**
 * 技能库卡片组件
 * 展示全栈开发技能，包含动态图标轨道和技能标签
 * @param {Array} skills - 技能名称数组
 * @param {string} language - 当前语言设置
 * @param {Object} cardData - 卡片配置数据
 */
const SkillLibraryCard = ({ skills, language, cardData }) => {
  const cardRef = useRef(null);
  
  // 获取当前语言的技能栈标签
  const skillsStackLabel = skillsStackLabels[language || "zh-cn"] || "技术栈";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 初始化动画状态
      gsap.set(".skill-card-left", { opacity: 0, x: -20 });
      gsap.set(".skill-card-right", { opacity: 0, x: 20 });
      gsap.set(".skill-title", { opacity: 0, y: 10 });
      gsap.set(".skill-description", { opacity: 0, y: 10 });
      gsap.set(".skill-label", { opacity: 0 });
      gsap.set(".skill-tag", { opacity: 0, y: 12, scale: 0.95 });

      // 创建滚动触发动画时间线
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // 左侧图标轨道区域动画
      tl.to(".skill-card-left", {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.4);

      // 右侧内容区域动画
      tl.to(".skill-card-right", {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 0.2);

      // 标题文字动画
      tl.to(".skill-title", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, 0.3);

      // 描述文字动画
      tl.to(".skill-description", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, 0.4);

      // 技能标签标题动画
      tl.to(".skill-label", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, 0.7);

      // 技能标签逐个出现动画
      skills.forEach((_, index) => {
        tl.to(`.skill-tag:nth-child(${index + 1})`, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }, 0.8 + index * 0.08);
      });

    }, cardRef);

    return () => ctx.revert();
  }, [skills]);

  /**
   * 为技能生成对应的图标
   * 支持精确匹配和模糊匹配
   * @returns {Array} 图标组件数组
   */
  const generateIcons = () => {
    return skills.map((skill) => {
      // 标准化技能名称（移除空格）
      const normalizedSkill = skill.replace(/\s+/g, "");

      // 首先尝试精确匹配
      let iconKey = Object.keys(techIcons).find(
        (key) => key.toLowerCase() === skill.toLowerCase()
      );

      // 如果没有精确匹配，尝试包含匹配
      if (!iconKey) {
        iconKey = Object.keys(techIcons).find(
          (key) =>
            key.toLowerCase().includes(normalizedSkill.toLowerCase()) ||
            normalizedSkill.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().replace(/\s+/g, "") ===
              normalizedSkill.toLowerCase()
        );
      }

      return techIcons[iconKey] || techIcons["default"];
    });
  };

  return (
    <div ref={cardRef} className="w-full h-full grid grid-cols-5 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
      {/* 左侧技能图标轨道展示区域（占3列） */}
      <div className="skill-card-left col-span-3 flex items-center justify-center relative">
        {/* 多层技能图标轨道容器 */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
          {/* 内圈轨道 - 前3个技能 */}
          <OrbitingCircles
            radius={60}
            duration={20}
            path={true}
            reverse={false}
            className="absolute"
          >
            {generateIcons()
              .slice(0, 3)
              .map((icon, index) => (
                <div
                  key={`inner-${index}`}
                  className="flex items-center justify-center"
                >
                  {icon}
                </div>
              ))}
          </OrbitingCircles>

          {/* 中圈轨道 - 第4-7个技能 */}
          <OrbitingCircles
            radius={120}
            duration={25}
            path={true}
            reverse={true}
            className="absolute"
          >
            {generateIcons()
              .slice(3, 7)
              .map((icon, index) => (
                <div
                  key={`middle-${index}`}
                  className="flex items-center justify-center"
                >
                  {icon}
                </div>
              ))}
          </OrbitingCircles>

          {/* 外圈轨道 - 剩余技能 */}
          <OrbitingCircles
            radius={180}
            duration={30}
            path={true}
            reverse={false}
            className="absolute"
          >
            {generateIcons()
              .slice(7)
              .map((icon, index) => (
                <div
                  key={`outer-${index}`}
                  className="flex items-center justify-center"
                >
                  {icon}
                </div>
              ))}
          </OrbitingCircles>
        </div>
      </div>

      {/* 右侧内容信息区域（占2列） */}
      <div className="skill-card-right col-span-2 flex flex-col justify-center lg:pl-6">
        {/* 标题和描述区域 */}
        <div className="mb-9">
          <h2 className="skill-title text-2xl lg:text-3xl font-bold text-foreground mb-4 tracking-wide">
            {cardData?.title}
          </h2>
          <p className="skill-description text-sm lg:text-base text-muted-foreground leading-relaxed max-w-xs opacity-80">
            {cardData?.description}
          </p>
        </div>

        {/* 技能标签展示区域 */}
        <div className="space-y-3">
          {/* 技能分组标题 */}
          <div className="skill-label flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gradient-to-b from-primary/60 to-primary/30 rounded-full"></div>
            <span className="text-sm font-medium text-muted-foreground tracking-wider uppercase">
              {skillsStackLabel}
            </span>
          </div>

          {/* 技能标签列表 */}
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="skill-tag px-3 lg:px-4 py-2 lg:py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillLibraryCard;
