import React from "react";

interface DetailsLabelProps {
    title: string;
    value: string;
}

const DetailsLabel:React.FC<DetailsLabelProps> = ({title, value}) => {
    return (
        <div className="flex text-md items-center">
            <span className="font-semibold text-xs md:text-base">{title}</span>
            <span className="font-bold px-1">-</span>
            <span className="text-black/70 truncate text-xs md:text-base">{value}</span>
        </div>
    );
}

export default DetailsLabel;