import { dashboardOverviewGuide } from "~/app/dashboard/overview/guide";

export type Guide = { question: string; answer: string };
export type Guides = Record<string, Guide[]>;

export const guides: Guides = {
  "default": [
    { question: "How to use this system?", answer: "Navigate through the sections using the sidebar menu." },
  ],
  "/dashboard/overview": dashboardOverviewGuide,
  "/settings": [
    { question: "How to update my profile?", answer: "Go to the 'Profile' section and edit your details." },
    { question: "Can I change my password?", answer: "Yes, under 'Security' settings, you can update your password." },
  ]
}