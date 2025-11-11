import { LucideIcon } from "lucide-react";

export interface AccountType {
    id: number;
    name: string;
    category: string;
    code?: string|null;
    icon: LucideIcon;
    requirements: string[];
}