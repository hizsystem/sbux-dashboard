"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  CalendarDays,
  Database,
} from "lucide-react";

const navItems = [
  { href: "/", label: "SUMMARY", icon: LayoutDashboard },
  { href: "/kpi", label: "KPI 트래킹", icon: TrendingUp },
  { href: "/budget", label: "예산/마진 관리", icon: Wallet },
  { href: "/timeline", label: "타임라인", icon: CalendarDays },
  { href: "/data", label: "데이터 보드", icon: Database },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 192,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid #e5e7eb",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <div
            style={{
              width: 22,
              height: 22,
              background: "#4f46e5",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>P</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>Project Master</span>
        </div>
        <p style={{ fontSize: 9, color: "#9ca3af", letterSpacing: "0.08em", marginLeft: 30 }}>
          MANAGEMENT SYSTEM
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                marginBottom: 2,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? "#4f46e5" : "#6b7280",
                background: active ? "#eef2ff" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
