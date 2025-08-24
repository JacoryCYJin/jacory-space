import "./globals.css";
import NavBar from "@/components/NavBar";
import { AppProvider } from "@/lib/context";

export const metadata = {
  title: "Jacory Space",
  description: "Jacory Space",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <NavBar />
          <main className="pt-14">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
