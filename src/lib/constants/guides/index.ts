export type Screen = {
  id: string;
  title: string;
  description: string;
  videoId: string;
  videos: {
    title : string;
    videoId: string;
  }[];
};

// export const guides: Guides = {
//   "default": [
//     { question: "How to use this system?", answer: "Navigate through the sections using the sidebar menu." },
//   ],
//   "/dashboard/overview": dashboardOverviewGuide,
//   "/settings": [
//     { question: "How to update my profile?", answer: "Go to the 'Profile' section and edit your details." },
//     { question: "Can I change my password?", answer: "Yes, under 'Security' settings, you can update your password." },
//   ]
// }

export const screens:Screen[] = [
  {
    id: "default",
    title: "Default",
    description: "This is the template guide for all sections of the system.",
    videoId: "8g9ccCkT-u0", // Replace with actual YouTube video ID
    videos: [
    ],
  },
  {
    id: "overview",
    title: "Overview",
    description: "Get an overview of the system and how to navigate through the sections.",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    videos: [
    ],
  },
  {
    id: "bookings",
    title: "Bookings",
    description: "Learn how to use this booking feature to manage your reservations.",
    videoId: "dQw4w9WgXcQ",
    videos: [
      {
        title: "Add Booking (Direct Customer)",
        videoId: "GetxEIEi0E4",
      },
      {
        title : "Add Booking (Not Direct Customer - Through Agent)",
        videoId: "GetxEIEi0E4",
      },
      {
        title: "Cancel Booking",
        videoId: "Y0bi8IznVLk",
      },
      {
        title: "Search Bookings",
        videoId: "TGUQK1IRNOc",
      },
      {
        title: "Itinerary",
        videoId: "dN9CI08Akjw",
      },
      {
        title: "Manage Transport Vouchers",
        videoId: "7gR5_oAdKS4",
      },
      {
        title: "Manage Hotel Vouchers",
        videoId: "mFvlS8fo4jk",
      },
      {
        title: "Manage Restaurant Vouchers",
        videoId: "nq8vm7Jx0eY",
      },
      {
        title: "Manage Activity Vouchers",
        videoId: "zHO1OdzLAMo",
      },
    ],
  },
  {
    id: "hotels",
    title: "Hotels",
    description: "Discover how to generate and customize reports for your business needs.",
    videoId: "dQw4w9WgXcQ",
    videos: [
      {
        title: "View Hotel",
        videoId: "F2Qv5XZ3gOE",
      },
      {
        title: "Add Hotel",
        videoId: "x9yZ_Zh3ZLo",
      },
      {
        title: "Edit Hotel",
        videoId: "MHeQJWrt-cU",
      },
      {
        title: "Delete Hotel",
        videoId: "0OO3sIgv4lU",
      },
    ],
  },
  {
    id: "restaurants",
    title: "Restaurants",
    description: "Learn how to manage restaurants.",
    videoId: "dQw4w9WgXcQ",
    videos: [
      {
        title: "View Restaurant",
        videoId: "anURtSJ9gSU",
      },
      {
        title: "Add Restaurant",
        videoId: "04VKD_EfYYQ",
      },
      {
        title: "Edit Restaurant",
        videoId: "kKunt2026P4",
      },
      {
        title: "Delete Restaurant",
        videoId: "JYlP46Tr7L0",
      },
    ],
  },
  {
    id: "activities",
    title: "Activities",
    description: "Explore how to manage activity vendors and activity types",
    videoId: "09lKmcYa3e8",
    videos: [
      {
        title: "Add Activity",
        videoId: "09lKmcYa3e8",
      },
      {
        title: "View Activity",
        videoId: "CtHaYEOH4Og",
      },
      {
        title: "Edit Activity",
        videoId: "vVABEA5WeFo",
      },
      {
        title: "Delete Activity",
        videoId: "JTozMeGsciY",
      },
    ],
  },
  {
    id: "transport",
    title: "Transport",
    description: "Understand how to manage transport, drivers and related services.",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    videos: [
      {
        title: "Add Guide",
        videoId: "ANN4buG084o",
      },
      {
        title: "View Guide",
        videoId: "8w_arSxYfrU",
      },
      {
        title: "Edit Guide",
        videoId: "sBnAk4ubueQ",
      },
      {
        title: "Delete Guide",
        videoId: "jDJZgcQxFrc",
      },


      {
        title: "Add Driver",
        videoId: "S2pCebZcYQg",
      },
      {
        title: "View Driver",
        videoId: "wH3qhez3PAU",
      },
      {
        title: "Edit Driver",
        videoId: "iGz6hXVCV3Y",
      },
      {
        title: "Delete Driver",
        videoId: "vVnRYIbjqgk",
      },


      {
        title: "Edit Other Transport",
        videoId: "chjKZp9ICSY",
      },
      {
        title: "Delete Transport",
        videoId: "JbBYKAxpZss",
      },
      {
        title: "Add Other Transport",
        videoId: "O_4ybAWZXTg",
      },
    ],
  },
  {
    id: "shops",
    title: "Shops",
    description: "Learn how to manage shops and their offerings.",
    videoId: "dQw4w9WgXcQ",
    videos: [
      {
        title: "View Shops",
        videoId: "wIQZ6tG78jA",
      },
      {
        title: "Add Shop",
        videoId: "Jm05QOzG3sA",
      },
      {
        title: "Edit Shop",
        videoId: "gf4AMV84yOI", 
      },
      {
        title: "Delete Shop",
        videoId: "O6XZAvKzKik",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    description: "See reports for your bookings and vendors",
    videoId: "BwB-bTZF0gg",
    videos: [
      {
        title: "View Reports",
        videoId: "BwB-bTZF0gg",
      },
    ],
  },
  {
    id: "agents",
    title: "Agents",
    description: "Learn how to manage agents and their permissions.",
    videoId: "dQw4w9WgXcQ",
    videos: [
      {
        title: "View Agent",
        videoId: "ri1TJnQfjbI",
      },
      {
        title: "Add Agent",
        videoId: "j_G0KtVAVBA",
      },
      {
        title: "Edit Agent",
        videoId: "L4mcY-u8Gxw",
      },
      {
        title: "Delete Agent",
        videoId: "RbFz0rG8Yxw",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure your account settings and preferences for optimal experience.",
    videoId: "25Tgmln4SCg",
    videos: [
      {
        title: "Manage Subscriptions",
        videoId: "25Tgmln4SCg",
      },
      {
        title: "Manage Roles & Permissions",
        videoId: "RFawA35Idj0",
      },
      {
        title: "Manage Marketing Teams",
        videoId: "VCbNOgTKCIQ",
      },
      {
        title: "Manage Bank Details",
        videoId: "nQcGdbrqhFk",
      },
      {
        title : "Manage Profile",
        videoId: "LQYi4XQZ7u0",
      },
      {
        title: "Manage Organization",
        videoId: "73tKbQCikDY",
      },
    ],
  },
]