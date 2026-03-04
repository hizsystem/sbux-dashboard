import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Master - SBUX Dashboard",
  description: "2026 네슬레 스타벅스앳홈 프로젝트 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
