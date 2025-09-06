"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "@/lib/context";
import { contactTexts } from "@/constants/Contact";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 导入组件
import ContactHero from "@/components/contact/ContactHero";
import ServicesSection from "@/components/contact/ServicesSection";
import ContactMethods from "@/components/contact/ContactMethods";
import ContactCTA from "@/components/contact/ContactCTA";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { language } = useApp();
  const currentTexts = contactTexts[language];
  const lenisRef = useRef(null);

  useEffect(() => {
    // 初始化 Lenis 平滑滚动
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // 将 Lenis 滚动与 GSAP ScrollTrigger 同步
    lenisRef.current.on("scroll", ScrollTrigger.update);

    // 使用 GSAP ticker 处理 Lenis 动画帧
    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

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
      lenisRef.current?.destroy();
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000);
      });
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
        <ContactHero texts={currentTexts} />

        {/* Services Section */}
        <ServicesSection texts={currentTexts} />

        {/* Contact Methods Section */}
        <ContactMethods texts={currentTexts} />

        {/* CTA Section */}
        <ContactCTA texts={currentTexts} />
      </div>
    </>
  );
};

export default Contact;
