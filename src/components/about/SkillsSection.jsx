"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";
import FullStackCard from "./FullStackCard";
import AnimationCard from "./AnimationCard";
import DesignCard from "./DesignCard";
import VideoCard from "./VideoCard";
import TetrisGridBackground from "../magicui/TetrisGridBackground";

gsap.registerPlugin(ScrollTrigger);

const SkillsSection = ({ texts }) => {
  const { language } = useApp();
  const sectionRef = useRef(null);
  const cardsWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 卡片水平滚动动画 - 使用绝对位置控制
      gsap.fromTo(
        cardsWrapperRef.current,
        {
          x: "0vw", // 起始位置：第一个卡片（标题）刚好在屏幕左侧
        },
        {
          x: "-200vw", // 移动距离：确保最后一个卡片完全显示
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top", // 当section顶部到达视窗顶部时开始
            end: "bottom top", // 当section底部到达视窗顶部时结束
            scrub: 3,
            pin: true, // 固定section，阻止垂直滚动
            anticipatePin: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 技能卡片数据
  const skillCards = [
    {
      component: FullStackCard,
      skills: texts.skills.fullstack,
      category: "fullstack",
      cardData: texts.skillCards.fullstack,
    },
    {
      component: AnimationCard,
      skills: texts.skills.animation,
      category: "animation",
      cardData: texts.skillCards.animation,
    },
    {
      component: DesignCard,
      skills: texts.skills.design,
      category: "design",
      cardData: texts.skillCards.design,
    },
    {
      component: VideoCard,
      skills: texts.skills.video,
      category: "video",
      cardData: texts.skillCards.video,
    },
  ];

  // 标题卡片组件
  const TitleCard = () => (
    <div className="w-full h-full flex flex-col justify-center items-center px-10 relative">
      <div className="text-center space-y-8">
        {/* 主标题 */}
        <h2 className="text-5xl lg:text-7xl font-black text-background tracking-wide">
          {texts.sections.skills}
        </h2>
        
        {/* 简约装饰线 */}
        <div className="w-24 h-px bg-background/30 mx-auto" />
        
        {/* 副标题 */}
        <p className="text-base lg:text-lg text-background/70 font-normal max-w-sm mx-auto leading-relaxed">
          {texts.sections.skillsSubtitle}
        </p>
      </div>
    </div>
  );

  // 技能卡片包装器组件
  const SkillCardWrapper = ({ children, index }) => (
    <div className="w-full h-full flex items-center justify-center p-4 relative group">
      {/* 发光效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* 卡片容器 - 移除最大宽度限制，充分利用60vw宽度 */}
      <div className="relative z-10 w-full max-w-4xl h-[60vh] bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl shadow-primary/10 overflow-hidden group-hover:shadow-primary/20 group-hover:border-primary/30 transition-all duration-500">
        {children}
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen group"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden" />

      {/* 俄罗斯方块网格背景 */}
      <TetrisGridBackground />

      <div className="relative z-10 h-full flex flex-col justify-center overflow-hidden">
        {/* 卡片展示区域 - 水平滚动容器 */}
        <div className="relative overflow-hidden w-screen h-full">
          {/* 卡片包装器 - 用于水平滚动 */}
          <div
            ref={cardsWrapperRef}
            className="flex h-full"
          >
            {/* 标题卡片 - 调整为与其他卡片相同大小 */}
            <div
              className="w-screen flex-shrink-0 h-full"
              style={{ width: "40vw" }}
            >
              <TitleCard />
            </div>

            {/* 渲染所有技能卡片 */}
            {skillCards.map((card, index) => {
              const CardComponent = card.component;
              return (
                <React.Fragment key={index}>
                  <div
                    className="w-screen flex-shrink-0 h-full"
                    style={{
                      width: "60vw", // 所有技能卡片统一宽度为60vw
                    }}
                  >
                    <SkillCardWrapper index={index}>
                      <CardComponent
                        skills={card.skills}
                        language={language}
                        cardData={card.cardData}
                      />
                    </SkillCardWrapper>
                  </div>

                  {/* 卡片之间的间距 */}
                  {index < skillCards.length - 1 && (
                    <div
                      className="w-screen flex-shrink-0 h-full"
                      style={{ width: "3vw" }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
