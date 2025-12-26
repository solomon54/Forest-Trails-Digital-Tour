// components/admin/dashboard/StatsSection.tsx
import React from "react";
import {
  HiUsers,
  HiCalendar,
  HiBell,
  HiGlobeAlt,
  HiServer,
  HiCheckCircle,
} from "react-icons/hi";
import StatCard, { StatCardProps } from "./ui/StatCard";

/* =======================
   Data Types
   ======================= */

interface Stats {
  totalUsers: number;
  activeBookings: number;
  pendingNotifications: number;
  pendingResources: number;
  liveListings: number;
  totalResources: number;
  systemUptime: string;
}

interface Props {
  stats: Stats;
}

/* =======================
   Component
   ======================= */

export default function StatsSection({ stats }: Props) {
  const cards: StatCardProps[] = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: "+12% vs last month",
      trend: "up",
      icon: <HiUsers className="text-3xl" />,
      color: "blue",
    },
   
    {
      title: "Pending Alerts",
      value: stats.pendingNotifications,
      trend: stats.pendingNotifications > 0 ? "up" : "neutral",
      icon: <HiBell className="text-3xl" />,
      color: "amber",
    },
    {
      title: "Pending Resources",
      value: stats.pendingResources,
      change: "Awaiting review",
      trend: "neutral",
      icon: <HiGlobeAlt className="text-3xl" />,
      color: "purple",
    },
    {
      title: "Live Tours",
      value: stats.liveListings,
      change: "Public & bookable",
      trend: "up",
      icon: <HiServer className="text-3xl" />,
      color: "indigo",
    },
     {
      title: "Active Bookings",
      value: stats.activeBookings,
      change: "+18 today",
      trend: "up",
      icon: <HiCalendar className="text-3xl" />,
      color: "emerald",
      sparkline: true,
    },
    {
      title: "System Status",
      value: "Safe",
      change: stats.systemUptime,
      trend: "up",
      icon: <HiCheckCircle className="text-4xl text-emerald-600" />,
      color: "emerald",
    },
    
  ];

  return (
    <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </section>
  );
}
