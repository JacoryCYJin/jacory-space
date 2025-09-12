import HeroSection from "@/components/home/HeroSection";
import FeatureSection from "@/components/home/FeatureSection";

/**
 * 首页组件 - 网站主页
 * 作者：JacoryJin
 *
 * @returns {JSX.Element} 渲染的首页组件
 */
export default function Home() {
  return (
    <div className="font-sans">
      <HeroSection />
      <FeatureSection />
    </div>
  );
}
