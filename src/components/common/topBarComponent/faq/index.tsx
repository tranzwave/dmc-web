"use client"

import { usePathname } from "next/navigation"
import { Info, Menu } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "~/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"

type Guide = { question: string; answer: string };
type Guides = Record<string, Guide[]>;

const guides: Guides = {
  "/dashboard": [
    { question: "How to navigate the dashboard?", answer: "Use the sidebar to access different sections." },
    { question: "Where can I see my notifications?", answer: "Notifications are available in the top-right bell icon." },
  ],
  "/settings": [
    { question: "How to update my profile?", answer: "Go to the 'Profile' section and edit your details." },
    { question: "Can I change my password?", answer: "Yes, under 'Security' settings, you can update your password." },
  ],
  "default": [
    { question: "How to use this system?", answer: "Navigate through the sections using the sidebar menu." },
  ]
}

export function GuideSheet() {
  const pathname = usePathname()
  const guideContent = guides[pathname] ?? guides.default

  if(!guideContent) return null

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Info size={20} color="#697077" className="hover:cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:max-w-[450px]">
        <SheetHeader>
          <SheetTitle className="text-[15px]">Page Guide</SheetTitle>
          <SheetDescription className="text-[13px]">
            Find helpful tips on using this section of the system.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {guideContent.map((guide, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-[14px]">{guide.question}</AccordionTrigger>
                <AccordionContent className="text-[13px]">{guide.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default GuideSheet
