// {
//     id: 1,
//     name: "Basic",
//     tabValue: "basic",
//     description: "Essential features for individuals",
//     price: 9.99,
//     icon: Zap,
//     features: ["Feature 1", "Feature 2", "Feature 3"],
//   },

import { LucideIcon } from "lucide-react";

export type Package = {
    id: number;
    name: string;
    tabValue: string;
    description: string;
    price: number;
    icon: LucideIcon;
    features: string[];
};
