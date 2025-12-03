import { Download, Eye } from "lucide-react";
import React from "react";

interface InformationTextProps {
    title: string;
    data: string;
    type?: string;
}

const InformationText: React.FC<InformationTextProps> = ({ title, data, type }) => {
    const formatFileName = (url: string) => {
        const file = url.split("/").pop() || "";
        const [name, ext] = file.split(/(?=\.[^.]+$)/);
        const shortName = name.length > 25 ? name.slice(0, 25) + "..." : name;
        return shortName + (ext || "");
    };
    const displayData = type === "file" ? formatFileName(data) : data;

    return (
        <div className="grid">
            <p className="text-xs opacity-75">{title}</p>
            <div className="flex items-center gap-2">
                <p className="font-bold text-xs opacity-75 break-all">{displayData}</p>
                {type === "file" && data !=='Not Submitted' && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => window.open(data, "_blank")} className="text-primary">
                            <Eye size={15} />
                        </button>
                        <a href={data} download target="_blank" className="text-blue-800"  >
                            <Download size={15} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InformationText;