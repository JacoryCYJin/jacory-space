"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 教育经历展示组件
 * 以时间线形式展示教育背景，包含动画效果
 * @param {Object} texts - 本地化文本内容
 */
const EducationSection = ({ texts }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const timelineRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 标题区域入场动画
      gsap.fromTo(
        titleRef.current,
        {
          y: 50,
          opacity: 0,
          rotationX: -90,
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 时间线连接线动画
      gsap.fromTo(
        timelineRef.current,
        {
          scaleY: 0,
          opacity: 0,
        },
        {
          scaleY: 1,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 教育经历卡片动画
      cardsRef.current.forEach((card, index) => {
        if (card) {
          // 卡片入场动画（左右交替进入）
          gsap.fromTo(
            card,
            {
              x: index % 2 === 0 ? -200 : 200,
              opacity: 0,
              rotation: index % 2 === 0 ? -10 : 10,
              scale: 0.8,
            },
            {
              x: 0,
              opacity: 1,
              rotation: 0,
              scale: 1,
              duration: 1.2,
              ease: "back.out(1.7)",
              delay: index * 0.3,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // 鼠标悬停交互效果
          const handleMouseEnter = () => {
            gsap.to(card, {
              y: -10,
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            });
          };

          const handleMouseLeave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          };

          card.addEventListener("mouseenter", handleMouseEnter);
          card.addEventListener("mouseleave", handleMouseLeave);

          return () => {
            card.removeEventListener("mouseenter", handleMouseEnter);
            card.removeEventListener("mouseleave", handleMouseLeave);
          };
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /**
   * 教育经历卡片组件
   * @param {Object} education - 教育经历数据
   * @param {number} index - 卡片索引
   * @param {boolean} isLast - 是否为最后一个卡片
   */
  const EducationCard = ({ education, index, isLast }) => (
    <div className="flex items-center group">
      {/* 左侧内容区域（偶数索引显示卡片，奇数索引占位） */}
      <div className={`flex-1 ${index % 2 === 0 ? 'pr-8' : 'pl-8 order-3'}`}>
        {index % 2 === 0 && (
          <div
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl relative overflow-hidden group-hover:bg-card"
          >
            {/* 背景装饰光效 */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {education.degree}
                  </h3>
                  <p className="text-primary font-medium">
                    {education.school}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {education.period}
                </span>
              </div>
              
              {/* 学位标识图标 */}
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span className="text-lg">🎓</span>
                <span className="text-sm">学位证书</span>
              </div>
            </div>

            {/* 悬停时的边框高亮效果 */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-colors duration-500" />
          </div>
        )}
      </div>

      {/* 中央时间线节点 */}
      <div className="flex flex-col items-center z-10">
        {/* 时间节点圆点 */}
        <div className="relative">
          <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg animate-pulse" />
          <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping" />
        </div>
        
        {/* 时间线连接线 */}
        {!isLast && (
          <div className="w-0.5 h-24 bg-gradient-to-b from-primary to-primary/30 mt-2" />
        )}
      </div>

      {/* 右侧内容区域（奇数索引显示卡片，偶数索引占位） */}
      <div className={`flex-1 ${index % 2 === 1 ? 'pl-8' : 'pr-8'}`}>
        {index % 2 === 1 && (
          <div
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl relative overflow-hidden group-hover:bg-card"
          >
            {/* 背景装饰光效 */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {education.degree}
                  </h3>
                  <p className="text-primary font-medium">
                    {education.school}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {education.period}
                </span>
              </div>
              
              {/* 学位标识图标 */}
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span className="text-lg">🎓</span>
                <span className="text-sm">学位证书</span>
              </div>
            </div>

            {/* 悬停时的边框高亮效果 */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-2xl transition-colors duration-500" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* 页面标题区域 */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {texts.sections.education}
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full" />
          
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
            知识的积累与成长的足迹
          </p>
        </div>

        {/* 教育经历时间线容器 */}
        <div className="relative">
          {/* 主时间线连接线（用于动画参考） */}
          <div 
            ref={timelineRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary to-primary/30 opacity-0"
          />

          <div className="space-y-8">
            {texts.education.map((education, index) => (
              <EducationCard
                key={index}
                education={education}
                index={index}
                isLast={index === texts.education.length - 1}
              />
            ))}
          </div>
        </div>

        {/* 底部装饰性标语 */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <span className="text-2xl">📚</span>
            <span className="text-sm">持续学习，永无止境</span>
            <span className="text-2xl">✨</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
