/**
 * 介绍卡片组件 - 首页展示的特色卡片
 * 作者：JacoryJin
 */
"use client";

import { forwardRef } from "react";

/**
 * 介绍卡片组件
 * 
 * 玻璃态效果卡片，左上角显示编号，左下角显示标题和副标题
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.number - 卡片编号（01-04）
 * @param {string} props.title - 卡片标题
 * @param {string} props.subtitle - 卡片副标题
 * @returns {JSX.Element} 渲染的介绍卡片
 */
const IntroductionCard = forwardRef(({ number, title, subtitle }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden
                   w-[280px] h-[280px] p-4
                   sm:w-[320px] sm:h-[320px] sm:p-5
                   md:w-[380px] md:h-[380px] md:p-6
                   lg:w-[420px] lg:h-[420px] lg:p-7
                   xl:w-[450px] xl:h-[450px] xl:p-8"
        style={{
          willChange: "transform, opacity",
          top: "30%",
          left: "30%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* 背景渐变效果 */}
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-20`}
        />

        {/* 卡片主要内容区域 */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* 左上角大号编号 */}
          <div className="flex justify-start">
            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                           font-black text-white/30 leading-none">
              {number}
            </span>
          </div>

          {/* 左下角标题和副标题 */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 
                         font-bold mb-1 sm:mb-2 text-primary-foreground leading-tight">
              {title}
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 
                        text-primary-foreground/80 font-medium">
              {subtitle}
            </p>
          </div>
        </div>

      </div>
    );
  }
);

IntroductionCard.displayName = "IntroductionCard";

export default IntroductionCard;
