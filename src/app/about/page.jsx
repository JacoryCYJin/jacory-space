"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "@/lib/context";
import { aboutTexts } from "@/constants/About";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 导入组件
import HeroSection from "@/components/about/HeroSection";
import SkillsSection from "@/components/about/SkillsSection";
import EducationSection from "@/components/about/EducationSection";
import InterestsSection from "@/components/about/InterestsSection";

gsap.registerPlugin(ScrollTrigger);

/**
 * 关于页面组件 - 个人介绍和技能展示
 * 作者：JacoryJin
 */

const About = () => {
  const { language } = useApp();
  const currentTexts = aboutTexts[language];

  useEffect(() => {
    // 页面加载动画
    gsap.set("body", { overflow: "hidden" });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set("body", { overflow: "auto" });
      },
    });

    tl.to(".loading-overlay", {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    }).set(".loading-overlay", { display: "none" });

    return () => {
      // 清理函数
    };
  }, []);

  return (
    <>
      {/* 加载覆盖层 */}
      <div className="loading-overlay fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-primary font-medium">Loading...</p>
        </div>
      </div>

      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection texts={currentTexts} />

        {/* Skills Section */}
        <SkillsSection texts={currentTexts} />

        {/* Education Section */}
        {/* <EducationSection texts={currentTexts} /> */}

        {/* Interests & Contact Section */}
        <InterestsSection texts={currentTexts} />
      </div>
    </>
  );
};

export default About;
