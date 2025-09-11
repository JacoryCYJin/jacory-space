import HeroSection from "@/components/home/HeroSection";
import IntroductionSection from "@/components/home/IntroductionSection";

/**
 * 首页组件
 *
 * 这是网站的主页，包含两个主要区域：
 * - HeroSection: 英雄区域，展示品牌标识和核心交互
 * - IntroductionSection: 介绍区域，展示网站功能特性
 *
 * @returns {JSX.Element} 渲染的首页组件
 */
export default function Home() {
  return (
    <div className="font-sans">
      <HeroSection />
      <IntroductionSection />
    </div>
  );
}
