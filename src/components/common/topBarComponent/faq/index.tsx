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
import { guides } from "~/lib/constants/guides"

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
