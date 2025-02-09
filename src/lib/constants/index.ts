import { Crown, GiftIcon, Star, Zap } from "lucide-react";
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

export const packages: Package[] = [
  {
    id: 0,
    name: "Start",
    tabValue: "start",
    description: "For entrepreneurial businesses",
    price: 5.0,
    icon: Zap,
    users: 5,
    trialPeriod: "1 month",
    features: [
      // "Start Your Free 1 month Trial",
      "Up to 5 users",
      "Unlimited Bookings",
      "Everything included in FREE and:",
    ],
    recuurence: "1 Month"
  },
  {
    id: 1,
    name: "Plus",
    tabValue: "plus",
    description: "For growing businesses",
    price: 20.0,
    icon: Star,
    users: 20,
    trialPeriod: "1 month",
    features: [
      // "Start Your Free 1 month Trial",
      "Up to 20 users",
      "Everything included in START",
    ],
    recuurence: "1 Month"
  },
  {
    id: 2,
    name: "Premium",
    tabValue: "premium",
    description: "For sophisticated, high volume businesses",
    price: 69.0,
    icon: Crown,
    users: "Unlimited",
    trialPeriod: "1 month",
    features: [
      // "Start Your Free 1 month Trial",
      "Unlimited users",
      "Everything included in PLUS",
    ],
    recuurence: "1 Month"
  },
];

