import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AppProvider } from "@/lib/context";
import LenisProvider from "@/components/providers/LenisProvider";

export const metadata = {
  title: "Jacory Space",
  description: "Jacory Space",
};

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
