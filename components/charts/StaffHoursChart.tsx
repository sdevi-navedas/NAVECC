"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { nhsStaffHours } from "@/data/mockData";
import { chartDefaults, colors } from "@/lib/design-system";

const barColors = [colors.coral, colors.amber, colors.blue, colors.muted];

export default function StaffHoursChart() {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={nhsStaffHours} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }} barSize={16}>
        <CartesianGrid strokeDasharray="" stroke={chartDefaults.gridColor} strokeWidth={0.5} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: chartDefaults.fontSize, fill: chartDefaults.tickColor, fontFamily: chartDefaults.fontFamily }}
          axisLine={false} tickLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <YAxis
          type="category" dataKey="label"
          tick={{ fontSize: chartDefaults.fontSize, fill: chartDefaults.tickColor, fontFamily: chartDefaults.fontFamily }}
          axisLine={false} tickLine={false} width={150}
        />
        <Tooltip
          contentStyle={chartDefaults.tooltipStyle}
          labelStyle={chartDefaults.tooltipLabelStyle}
          itemStyle={chartDefaults.tooltipItemStyle}
          formatter={(v) => [`${v}h`, "Hours lost"]}
        />
        <Bar dataKey="hours" radius={[0, 3, 3, 0]}>
          {nhsStaffHours.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
