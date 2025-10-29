"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  bgColor?: string;
  to?: string
}

export default function StatsCard({ title, value, icon, bgColor = "bg-blue-600", to }: StatsCardProps) {
  return (
    <Link
    href={to || '#'}
     className={`flex items-center gap-4 p-4 rounded-2xl shadow-lg text-white ${bgColor}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Link>
  );
}
