"use client";
import React from "react";

interface SpinnerProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-primary dark:border-t-black dark:border-b-white border-b-primary border-l-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;