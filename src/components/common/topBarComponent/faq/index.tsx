"use client"

import { useEffect, useState } from "react"
import { Info } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Screen, screens } from "~/lib/constants/guides"
import { usePathname } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

export default function GuideSheet() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [screen, setScreen] = useState<Screen>(screens[0]!)
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; videoId: string } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const currentPath = pathname.split("dashboard/")[1]
    if (!currentPath) {
      setScreen(screens[0]!)
      return
    }
    const currentSubScreen = currentPath.split("/")[currentPath.split("/").length - 1]
    const mainScreen = currentPath.split("/")[0]
    const screenToSearchFor = currentSubScreen ? `${mainScreen}/${currentSubScreen}` : currentPath
    const currentScreen = screens.find((s) => s.id === (mainScreen === currentSubScreen ? mainScreen : screenToSearchFor))
    if (currentScreen) {
      setScreen(currentScreen)
    } else {
      setScreen(screens[0]!)
    }
  }, [pathname])

  const handleVideoSelect = (video: { title: string; videoId: string }) => {
    setSelectedVideo(video)
    setDialogOpen(true)
    setMenuOpen(false)
  }

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <Info size={20} color="#697077" className="hover:cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <div className="mb-2 font-semibold text-base">{screen.title} Guide Videos</div>
          <div className="flex flex-col gap-2">
            {screen.videos && screen.videos.length > 0 ? (
              screen.videos.map((video) => (
                <Button
                  key={video.videoId}
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleVideoSelect(video)}
                >
                  {video.title}
                </Button>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No videos available for this section.</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[900px] min-h-[70vh] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {screen.title} Guide - {selectedVideo?.title}
              </DialogTitle>
            </div>
            {screen.description && (
              <DialogDescription className="text-sm text-muted-foreground mt-2">{screen.description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg">
            {selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                title={`${selectedVideo.title} guide video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}








// "use client"

// import { usePathname } from "next/navigation"
// import { Info, Menu } from "lucide-react"
// import { Button } from "~/components/ui/button"
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetClose,
// } from "~/components/ui/sheet"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
// import { guides } from "~/lib/constants/guides"

// export function GuideSheet() {
//   const pathname = usePathname()
//   const guideContent = guides[pathname] ?? guides.default

//   if(!guideContent) return null

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Info size={20} color="#697077" className="hover:cursor-pointer" />
//       </SheetTrigger>
//       <SheetContent className="w-[90vw] sm:max-w-[450px]">
//         <SheetHeader>
//           <SheetTitle className="text-[15px]">Page Guide</SheetTitle>
//           <SheetDescription className="text-[13px]">
//             Find helpful tips on using this section of the system.
//           </SheetDescription>
//         </SheetHeader>
//         <div className="mt-6">
//           <Accordion type="single" collapsible className="w-full">
//             <div>
//             <iframe width="300" height="215" src="https://www.youtube.com/embed/eZTfcki3HRo?si=eHeROKI17DPiPNlH" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
//             </div>
//             {/* {guideContent.map((guide, index) => (
//               <AccordionItem key={index} value={`item-${index}`}>
//                 <AccordionTrigger className="text-[14px]">{guide.question}</AccordionTrigger>
//                 <AccordionContent className="text-[13px]">{guide.answer}</AccordionContent>
//               </AccordionItem>
//             ))} */}
//           </Accordion>
//         </div>
//         <div className="mt-6">
//           <SheetClose asChild>
//             <Button variant="outline" className="w-full">
//               Close
//             </Button>
//           </SheetClose>
//         </div>
//       </SheetContent>
//     </Sheet>
//   )
// }

// export default GuideSheet
