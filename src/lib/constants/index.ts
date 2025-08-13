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
  "booking:read",
  "booking:create",
  "booking:cancel",

  "booking:manage",
  "booking_general_info:manage",
  "booking_hotel:manage",
  "booking_rest:manage",
  "booking_transport:manage",
  "booking_activity:manage",
  "booking_shops:manage",
  "booking_agent:manage",
  "booking_invoice:manage",
  "booking:tour_packet:manage",

  "dashboard_hotel:manage",
  "dashboard_rest:manage",
  "dashboard_activity:manage",
  "dashboard_transport:manage",
  "dashboard_shops:manage",
  "dashboard_agent:manage",
  "dashboard_invoice:manage",

  "sys_domains:manage",
  "sys_domains:read",
  "sys_memberships:manage",
  "sys_memberships:read",
  "sys_profile:delete",
  "sys_profile:manage",
  
] as const;

export const packages: Package[] = [
  {
    id: 0,
    name: "Free",
    tabValue: "free",
    description: "The basics needed to trial Coord.travel",
    price: 0.0,
    icon: Zap,
    users: 1,
    trialPeriod: "unlimited",
    features: [
      // "Start Your Free 1 month Trial",
      "No credit card required. Cancel anytime",
      "1 user",
      "Limited bookings",
      "Basic reporting and analysis"
    ],
    recurrence: "1 Month",
    currency: "USD",
  },
  {
    id: 1,
    name: "Basic",
    tabValue: "basic",
    description: "Ideal for small DMCs and startups ready to grow",
    price: 1.0,

    icon: Zap,
    users: 5,
    trialPeriod: "1 month",
    features: [
      // "Start Your Free 1 month Trial",
      "Up to 5 users",
      "Everything included in FREE and:",
      "Unlimited Bookings",
      "Unlimited Hotels"
    ],
    recurrence: "1 Month",
    currency: "USD"
  },
  {
    id: 2,
    name: "Plus",
    tabValue: "plus",
    description: "For Growing DMCs & Mid-Sized Agencies",
    price: 20.0,
    icon: Star,
    users: 20,
    trialPeriod: "1 month",
    features: [
      // "Start Your Free 1 month Trial",
      "Up to 20 users",
      "Unlimited Bookings",
      "Unlimited Hotels",
      "Unlimited Agents",
    ],
    recurrence: "1 Month",
    currency: "USD"
  },
  {
    id: 3,
    name: "Enterprise",
    tabValue: "enterprise",
    description: "For Large DMCs & Established Tour Operators",
    price: 69.0,
    icon: Crown,
    users: "Unlimited",
    trialPeriod: "1 month",
    features: [
      // "Start Your Free 1 month Trial",
      "Unlimited users",
      "Everything included in PLUS",
      "Priority support",
      "Dedicated account management",
    ],
    recurrence: "1 Month",
    currency: "USD"
  },
];

