"use client";

import React from "react";
import { motion } from "framer-motion";

const AnimationCard = ({ skills, language, cardData }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-3">
      <div className="w-full mx-auto">
        {/* 头部区域 */}
        <div className="text-center mb-6">
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
                  {cardData?.projects?.[0]?.title || (language === 'en' ? 'Interactive Dashboard' : '交互式仪表板')}
                </h5>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cardData?.projects?.[0]?.description || (language === 'en' ? 'Real-time data visualization with smooth animations' : '具有流畅动画效果的实时数据可视化')}
              </p>
            </div>

            {/* 项目2 */}
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
