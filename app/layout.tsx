import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import MainLayout from "@/components/layout/main-layout";

export const metadata: Metadata = {
  title: "Xitter",
  description: "",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="dark"
            enableSystem={false}
            themes={[
              "light",
              "light-high-contrast",
              "dark",
              "dark-high-contrast",
            ]}
          >
            <MainLayout>{children}</MainLayout>
            <ThemeToggle />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
