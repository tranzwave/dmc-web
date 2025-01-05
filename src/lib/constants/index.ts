import { Crown, Star, Zap } from "lucide-react";
import { Package } from "../types/payment";

export const tourTypes = [
  "General",
  "Cultural",
  "Adventure",
  "City",
  "Historical",
  "Wildlife Safari",
  "Culinary",
  "Religious",
  "Professional",
  "Honeymoon",
];

export const hotelRoomCategories = [
  "Standard Room",
  "Deluxe Room",
  "Superior Room",
  "Family Superior Room",
  "Family Room",
  "Ocean View Pool Villa",
  "Beach Pool Villa",
  "Premier Ocean View Pool Villa",
  "Premier Beach Pool Villa",
  "Ocean View Chalet",
  "Beach Cottage",
  "Garden Room",
  "Tropical Garden Room",
  "Junior Suite",
  "Senior Suite",
  "Executive Suite",
];

export const hotelRoomTypes = [
  "Single",
  "Double",
  "Twin",
  "Triple",
  "Quadruple",
  "01 Bedroom",
  "02 Bedroom",
  "03 Bedroom",
  "04 Bedroom",
  "Extra Bed",
  "Sharing Double",
  "Sharing Triple",
];

export const hotelBoardBasis = [
  "Room Only", // No meals included
  "Bed and Breakfast (B&B)", // Includes breakfast
  "Half Board", // Includes breakfast and one other main meal (usually dinner)
  "Full Board", // Includes breakfast, lunch, and dinner
  "All-Inclusive", // Includes all meals, drinks, and sometimes snacks
  "Ultra All-Inclusive", // Includes premium meals, drinks, snacks, and extra services
  "Self-Catering", // No meals included, guests have access to kitchen facilities
  "Full American Plan", // Includes breakfast, lunch, and dinner (often more elaborate)
  "Modified American Plan", // Includes breakfast and either lunch or dinner
  "European Plan", // Room-only, meals are paid separately
];

export const permissionsList = [
  "booking_activity:manage",
  "booking_agent:manage",
  "booking_hotel:manage",
  "booking_invoice:manage",
  "booking_rest:manage",
  "booking_shops:manage",
  "booking_transport:manage",
  "sys_domains:manage",
  "sys_domains:read",
  "sys_memberships:manage",
  "sys_memberships:read",
  "sys_profile:delete",
  "sys_profile:manage",
];

export const packages:Package[] = [
  {
    id: 1,
    name: "Basic",
    tabValue: "basic",
    description: "Essential features for individuals",
    price: 9.99,
    icon: Zap,
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    id: 2,
    name: "Pro",
    tabValue: "pro",
    description: "Advanced tools for professionals",
    price: 19.99,
    icon: Star,
    features: ["All Basic features", "Feature 4", "Feature 5", "Feature 6"],
  },
  {
    id: 3,
    name: "Enterprise",
    tabValue: "enterprise",
    description: "Comprehensive solution for large teams",
    price: 49.99,
    icon: Crown,
    features: ["All Pro features", "Feature 7", "Feature 8", "Feature 9", "24/7 Support"],
  },
]
