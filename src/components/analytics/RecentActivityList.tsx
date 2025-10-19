'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, XCircle, DollarSign, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityData {
  id: string;
  type: string;
  title: string;
  clipperName?: string;
  creatorName?: string;
  status: string;
  amount?: number;
  date: string;
  actionUrl: string;
}

interface RecentActivityListProps {
  data: ActivityData[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'APPROVED':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'REJECTED':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'PAID':
      return <DollarSign className="h-4 w-4 text-purple-500" />;
    case 'PAYMENT_FAILED':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    case 'PAID':
      return 'bg-purple-100 text-purple-800';
    case 'PAYMENT_FAILED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function RecentActivityList({ data }: RecentActivityListProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No recent activity</p>
        <p className="text-sm">Activity will appear here as you submit clips and get paid</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((activity) => (
        <Card key={activity.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.clipperName && `Clipper: ${activity.clipperName}`}
                  {activity.creatorName && `Creator: ${activity.creatorName}`}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </p>
                  {activity.amount && (
                    <p className="text-sm font-medium text-gray-900">
                      ${activity.amount.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
