"use client";

import React, { useEffect, useRef } from "react";
import { useApp } from "@/lib/context";
import { contactTexts } from "@/constants/Contact";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 导入组件
import ContactHero from "@/components/contact/ContactHero";
import ServicesSection from "@/components/contact/ServicesSection";
import ContactMethods from "@/components/contact/ContactMethods";
import ContactCTA from "@/components/contact/ContactCTA";

gsap.registerPlugin(ScrollTrigger);

/**
 * 联系页面组件 - 联系方式和服务展示
 * 作者：JacoryJin
 */

const Contact = () => {
  const { language } = useApp();
  const currentTexts = contactTexts[language];

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
