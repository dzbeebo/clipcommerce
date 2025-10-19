'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PerformerData {
  id: string;
  name: string;
  totalSubmissions: number;
  approvedSubmissions: number;
  totalEarned: number;
  approvalRate: number;
}

interface TopPerformersTableProps {
  data: PerformerData[];
  type: 'clipper' | 'creator';
}

export function TopPerformersTable({ data, type }: TopPerformersTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {type === 'clipper' ? 'clippers' : 'creators'} found</p>
        <p className="text-sm">Data will appear here as you work with {type === 'clipper' ? 'clippers' : 'creators'}</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{type === 'clipper' ? 'Clipper' : 'Creator'}</TableHead>
            <TableHead>Submissions</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead>Approval Rate</TableHead>
            <TableHead className="text-right">Total Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((performer) => (
            <TableRow key={performer.id}>
              <TableCell className="font-medium">{performer.name}</TableCell>
              <TableCell>{performer.totalSubmissions}</TableCell>
              <TableCell>{performer.approvedSubmissions}</TableCell>
              <TableCell>
                <Badge 
                  variant={performer.approvalRate >= 80 ? 'default' : performer.approvalRate >= 60 ? 'secondary' : 'destructive'}
                >
                  {performer.approvalRate.toFixed(1)}%
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${performer.totalEarned.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
