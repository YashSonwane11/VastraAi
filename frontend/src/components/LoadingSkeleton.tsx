import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export default function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`card-premium overflow-hidden animate-pulse bg-white border border-gray-100 ${className}`}>
      {/* Image Skeleton */}
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
      {/* Content Skeleton */}
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 bg-gray-200 rounded-full w-2/3" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="pt-2 flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded-full w-1/3" />
          <div className="h-7 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}
