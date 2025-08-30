"use client";

import React from "react";
import { motion } from "framer-motion";

const DesignCard = ({ skills, language, cardData }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-3">
      <div className="w-full mx-auto">
        {/* 头部区域 */}
        <div className="text-center mb-6">
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

        {/* 技能标签区域 */}
        <div className="mb-6">
          <h4 className="text-base lg:text-lg font-semibold text-foreground mb-4 text-center">
            {language === 'en' ? 'Technologies' : '技术栈'}
          </h4>
          <div className="flex flex-wrap gap-1.5 lg:gap-2 justify-center">
            {skills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                className="px-2.5 lg:px-3 py-1 lg:py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        {/* 作品展示区域 */}
        <div className="space-y-4">
          <h4 className="text-base lg:text-lg font-semibold text-foreground text-center">
            {language === 'en' ? 'Featured Projects' : '精选项目'}
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {/* 项目1 */}
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

            {/* 项目2 */}
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
