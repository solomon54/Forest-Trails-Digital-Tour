// components/admin/dashboard/StatsSection.tsx
import React from "react";
import { HiUsers, HiCalendar, HiBell, HiFolder, HiServer } from "react-icons/hi";
import StatCard from "./ui/StatCard";

export default function StatsSection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <StatCard title="Total Users" value="1,248" change="+12% vs last month" trend="up" icon={<HiUsers className="text-3xl" />} color="blue" />
      <StatCard title="Active Bookings" value="89" change="+18 today" trend="up" sparkline icon={<HiCalendar className="text-3xl" />} color="emerald" />
      <StatCard title="Pending Alerts" value="6" change="-2 resolved" trend="down" icon={<HiBell className="text-3xl" />} color="amber" />
      <StatCard title="Resources" value="42" change="+2 added" trend="up" icon={<HiFolder className="text-3xl" />} color="purple" />
      <StatCard title="System Uptime" value="99.9%" change="stable" icon={<HiServer className="text-3xl" />} color="indigo" />
    </section>
  );
}