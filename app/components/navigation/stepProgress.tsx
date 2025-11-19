"use client";

import React from "react";

interface StepProgressProps {
  steps: string[];
  activeStep: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ steps, activeStep }) => {
  return (
    <div className="border-b border-gray-300">
      <div className="relative flex justify-between md:mx-26  pb-4 md:pt-1">
        {steps.length === 3 && (
          <>
            <div
              className={`absolute top-7 md:top-10 left-18 md:left-27 right-[58%] md:right-[55%] h-0.5 z-0 transition-colors duration-300 ${
                activeStep > 1 ? "bg-primary" : "bg-gray-500"
              }`}
            />
            <div
              className={`absolute top-7 md:top-10 left-[54%] md:left-[53%] right-20 md:right-30 h-0.5 z-0 transition-colors duration-300 ${
                activeStep > 2 ? "bg-primary" : "bg-gray-500"
              }`}
            />
          </>
        )}

        {steps.map((label, index) => {
          const isActive = index + 1 <= activeStep;
          return (
            <div
              key={label}
              className="flex flex-col items-center z-10 relative"
            >
              <p
                className={`w-8 md:w-11 h-8 md:h-11 rounded-full flex items-center justify-center font-extrabold ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-500 text-white/70"
                }`}
              >
              {index + 1 < activeStep ? "✓" : index + 1}
              </p>
              <p
                className={`text-xs md:text-[16px] pt-1 w-1/3 md:w-full items-center flex justify-center text-center ${
                  isActive ? "text-black font-medium dark:text-white" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;