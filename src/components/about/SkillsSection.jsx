"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "@/lib/context";
import SkillLibraryCard from "./SkillLibraryCard";
import AnimationCard from "./AnimationCard";
import DesignCard from "./DesignCard";
import VideoCard from "./VideoCard";
import TetrisGridBackground from "@/components/magicui/TetrisGridBackground";
import { skillCardsData } from "@/constants/about/SkillLibrary";

gsap.registerPlugin(ScrollTrigger);

/**
 * 技能展示区域组件
 * 采用水平滚动卡片布局展示各项技能
 * @param {Object} texts - 本地化文本内容
 */
const SkillsSection = ({ texts }) => {
  const { language } = useApp();
  const sectionRef = useRef(null);
  const cardsWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 水平滚动动画，固定区域
      gsap.fromTo(
        cardsWrapperRef.current,
        { x: "0vw" },
        {
          x: "-200vw",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 3,
            pin: true,
            anticipatePin: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const skillCards = [
    {
      component: SkillLibraryCard,
      skills: texts.skills.fullstack,
      category: "fullstack",
      cardData: skillCardsData[language]?.fullstack || skillCardsData["zh-cn"].fullstack,
    },
    {
      component: AnimationCard,
      skills: texts.skills.animation,
      category: "animation",
      cardData: skillCardsData[language]?.animation || skillCardsData["zh-cn"].animation,
    },
    {
      component: DesignCard,
      skills: texts.skills.design,
      category: "design",
      cardData: skillCardsData[language]?.design || skillCardsData["zh-cn"].design,
    },
    {
      component: VideoCard,
      skills: texts.skills.video,
      category: "video",
      cardData: skillCardsData[language]?.video || skillCardsData["zh-cn"].video,
    },
  ];

  const TitleCard = () => (
    <div className="w-full h-full flex flex-col justify-center items-center px-10 relative">
      <div className="text-center space-y-8">
        <h2 className="text-5xl lg:text-7xl font-black text-background tracking-wide">
          {texts.sections.skills}
        </h2>
        
        <div className="w-24 h-px bg-background/30 mx-auto" />
        
        <p className="text-base lg:text-lg text-background/70 font-normal max-w-sm mx-auto leading-relaxed">
          {texts.sections.skillsSubtitle}
        </p>
      </div>
    </div>
  );

  const SkillCardWrapper = ({ children, index }) => (
    <div className="w-full h-full flex items-center justify-center p-4 relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden" />

      <TetrisGridBackground />

      <div className="relative z-10 h-full flex flex-col justify-center overflow-hidden">
        <div className="relative overflow-hidden w-screen h-full">
          <div
            ref={cardsWrapperRef}
            className="flex h-full"
          >
            <div
              className="w-screen flex-shrink-0 h-full"
              style={{ width: "40vw" }}
            >
              <TitleCard />
            </div>

            {skillCards.map((card, index) => {
              const CardComponent = card.component;
              return (
                <React.Fragment key={index}>
                  <div
                    className="w-screen flex-shrink-0 h-full"
                    style={{ width: "60vw" }}
                  >
                    <SkillCardWrapper index={index}>
                      <CardComponent
                        skills={card.skills}
                        language={language}
                        cardData={card.cardData}
                      />
                    </SkillCardWrapper>
                  </div>

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
