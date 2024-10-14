import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProgressBarProps {
  statusIndex: number;
  onStatusClick: (index: number) => void; // Click handler
  statusLabels: { label: string; icon: any }[]; // Thêm thuộc tính này
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  statusIndex,
  onStatusClick,
  statusLabels, // Nhận statusLabels từ props
}) => {
  const [tooltip, setTooltip] = useState<string | null>(null); // State for tooltip

  const renderLine = (isActive: boolean) => (
    <div
      className={`h-1 flex-grow ${isActive ? "bg-[#00b7c0]" : "bg-gray-300"}`}
    ></div>
  );

  return (
    <div className="flex items-center justify-between w-full mb-4 relative">
      {statusLabels.map((status, index) => (
        <div
          key={index}
          className="flex items-center w-full relative"
          onMouseEnter={() => setTooltip(status.label)} // Show tooltip on hover
          onMouseLeave={() => setTooltip(null)} // Hide tooltip when not hovering
        >
          {/* Render line on the left of the icon */}
          {index > 0 && renderLine(index <= statusIndex)}

          {/* Render icon */}
          <div
            onClick={() => onStatusClick(index)}
            className="flex justify-center items-center z-10 cursor-pointer mx-4 relative"
          >
            <FontAwesomeIcon
              icon={status.icon}
              className={`text-2xl ${index <= statusIndex ? "text-[#00b7c0]" : "text-gray-400"}`} // Orange for active, gray for inactive
            />
            {/* Tooltip with arrow */}
            {tooltip === status.label && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 z-20 transition-opacity duration-300 opacity-100">
                <div className="relative">
                  {tooltip}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-700"></div>
                </div>
              </div>
            )}
          </div>

          {/* Render line on the right of the icon */}
          {index < statusLabels.length - 1 && renderLine(index < statusIndex)}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
