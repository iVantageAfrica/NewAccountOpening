"use client";

import React, { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  index?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  index = 0,
  isActive = false,
  onClick,
}) => {
  return (
    <div className="mb-4">
      <div
        onClick={onClick}
        className={`flex justify-between items-center rounded-t-md p-2 md:p-4 border border-gray-300 w-full cursor-pointer transition-colors ${
          isActive ? "bg-gray-200" : "bg-white"
        }`}
      >
        <p className="w-6 md:w-11 h-6 md:h-11 text-sm md:text-lg rounded-full flex items-center justify-center font-extrabold bg-primary text-white">
          {index + 1}
        </p>
        <p
          className={`text-sm md:text-lg ml-4 md:ml-12 flex-1 font-bold ${
            isActive ? "text-black" : "text-gray-700"
          }`}
        >
          {title}
        </p>
        <p className="md:mr-8">
          {isActive ? (
            <ChevronUp className="p-1 md:p-0" />
          ) : (
            <ChevronDown className="p-1 md:p-0" />
          )}
        </p>
      </div>

      {isActive && (
        <div className="border-x border-b border-gray-300 rounded-b-md">
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps>[];
  onChangeStep?: (step: number) => void;
}

export const Accordion: React.FC<AccordionProps> = ({ children,onChangeStep }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
    if (onChangeStep) onChangeStep(index + 1);
  };

  return (
    <div>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          index,
          isActive: activeIndex === index,
          onClick: () => handleClick(index),
        })
      )}
    </div>
  );
};