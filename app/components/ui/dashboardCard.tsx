import React from "react";

interface DashboardStatCardProps {
  label: string;
  value?: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  label,
  value,
  icon,
  iconBg = "bg-gray-200",
  iconColor = "text-black"
}) => {
  return (
    <div className="bg-white rounded-md px-7 py-4 shadow-white shadow-lg cursor-pointer hover:transition hover:scale-105">
      <div className="flex justify-between items-center">
        <p className="font-bold text-md text-black/70">{label}</p>

        <div className={`${iconBg} rounded-full p-2 flex items-center justify-center`}>
          <div className={`${iconColor} w-6 h-6`}>{icon}</div>
        </div>
      </div>

      <p className="font-bold text-3xl pt-3">{value}</p>
    </div>
  );
};

export default DashboardStatCard;