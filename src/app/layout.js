import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AppProvider } from "@/lib/context";
import LenisProvider from "@/components/providers/LenisProvider";

/**
 * 网站元数据配置
 * 定义网站的基本SEO信息和页面标题
 */
export const metadata = {
  title: "Jacory Space",
  description: "Jacory Space",
};

/**
 * 根布局组件
 * 
 * 这是整个应用的根布局组件，定义了页面的基本结构。
 * 主要功能包括：
 * - 提供HTML文档结构
 * - 集成平滑滚动功能（LenisProvider）
 * - 提供全局应用状态管理（AppProvider）
 * - 包含顶部导航栏（NavBar）
 * - 包含页面主要内容区域
 * - 包含底部页脚（Footer）
 * 
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件内容
 * @returns {JSX.Element} 渲染的根布局组件
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <AppProvider>
            <NavBar />
            <main>
              {children}
            </main>
            <Footer />
          </AppProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
