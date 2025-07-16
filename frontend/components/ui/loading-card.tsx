import React from 'react';
import { Card, CardHeader, CardContent } from './card';

export function LoadingCard() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
  );
}