'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface OverviewChartProps {
  data: {
    pending: number;
    approved: number;
    rejected: number;
    paid: number;
    paymentFailed: number;
  };
}

const COLORS = {
  pending: '#3b82f6',
  approved: '#10b981',
  rejected: '#ef4444',
  paid: '#8b5cf6',
  paymentFailed: '#f59e0b'
};

export function OverviewChart({ data }: OverviewChartProps) {
  const chartData = [
    { name: 'Pending', value: data.pending, color: COLORS.pending },
    { name: 'Approved', value: data.approved, color: COLORS.approved },
    { name: 'Rejected', value: data.rejected, color: COLORS.rejected },
    { name: 'Paid', value: data.paid, color: COLORS.paid },
    { name: 'Payment Failed', value: data.paymentFailed, color: COLORS.paymentFailed }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value} submissions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
