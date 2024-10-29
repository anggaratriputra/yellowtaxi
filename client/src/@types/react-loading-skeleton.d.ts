declare module "react-loading-skeleton" {
    import React from "react";
  
    interface SkeletonProps {
      count?: number;
      height?: number | string;
      width?: number | string;
      className?: string;
      // Add any other props that you use
    }
  
    const Skeleton: React.FC<SkeletonProps>;
    export default Skeleton;
  }