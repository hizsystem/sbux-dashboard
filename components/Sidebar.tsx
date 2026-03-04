"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, Wallet, CalendarDays, Database } from "lucide-react";

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
    <aside className="w-48 min-h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-bold text-gray-900 text-sm">Project Master</span>
        </div>
        <p className="text-[10px] text-gray-400 ml-7">MANAGEMENT SYSTEM</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
