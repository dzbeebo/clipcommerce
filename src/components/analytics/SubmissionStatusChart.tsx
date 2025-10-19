'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SubmissionStatusChartProps {
  data: {
    pending: number;
    approved: number;
    rejected: number;
    paid: number;
    paymentFailed: number;
  };
}

export function SubmissionStatusChart({ data }: SubmissionStatusChartProps) {
  const chartData = [
    { status: 'Pending', count: data.pending, color: '#3b82f6' },
    { status: 'Approved', count: data.approved, color: '#10b981' },
    { status: 'Rejected', count: data.rejected, color: '#ef4444' },
    { status: 'Paid', count: data.paid, color: '#8b5cf6' },
    { status: 'Failed', count: data.paymentFailed, color: '#f59e0b' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
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
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
