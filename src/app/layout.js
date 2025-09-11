import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AppProvider } from "@/lib/context";
import LenisProvider from "@/components/providers/LenisProvider";

/**
 * 网站元数据配置
 * 作者：JacoryJin
 */
export const metadata = {
  title: "Jacory Space",
  description: "Jacory Space",
};

/**
 * 根布局组件 - 应用基础结构
 * 作者：JacoryJin
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
            <main>{children}</main>
            <Footer />
          </AppProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
