import { dashboardOverviewGuide } from "~/app/dashboard/overview/guide";

export type Screen = {
  id: string;
  title: string;
  description: string;
  videoId: string;
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
  },
  // {
  //   id: "overview",
  //   title: "Overview",
  //   description: "Get an overview of the system and how to navigate through the sections.",
  //   videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
  // },
  // {
  //   id: "bookings",
  //   title: "Bookings",
  //   description: "Learn how to use this booking feature to manage your reservations.",
  //   videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
  // },
  // {
  //   id: "hotels",
  //   title: "Hotels",
  //   description: "Discover how to generate and customize reports for your business needs.",
  //   videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
  // },
  // {
  //   id: "hotels/edit",
  //   title: "Edit Hotel",
  //   description: "Learn how to edit hotel details and update information for your business.",
  //   videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
  // },
  // {
  //   id: "restaurants",
  //   title: "Restaurants",
  //   description: "Configure your account settings and preferences for optimal experience.",
  //   videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
  // },
]