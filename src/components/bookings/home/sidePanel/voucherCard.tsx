"use cleint"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { ArrowRightCircleIcon, Lock } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { Skeleton } from "~/components/ui/skeleton"

interface CategoryDetails {
    title: string
    totalVouchers: number
    statusCount: {
        inprogress: number
        amended: number
        sentToClient: number
        vendorConfirmed: number
        cancelled: number
    }
    locked: boolean
}

interface BookingProps {
    id: string
    status: string
}

interface RenderCardProps {
    category?: CategoryDetails
    booking?: BookingProps
    loadingTitle?:string
    tab?:string
    pathname: string
}

const StatusBadge = ({ count, label, color }: { count: number; label: string; color: string }) => (
    <div className="flex flex-col items-center">
        <Badge variant="outline" className={`text-lg font-semibold ${color} mb-1`}>
            {count}
        </Badge>
        <span className="text-xs text-gray-600">{label}</span>
    </div>
)

export const RenderCard = ({ category, booking, pathname, loadingTitle, tab }: RenderCardProps) => {

    useEffect(() => {
        console.log("category", category)
    }
    , [booking])


    if (!category || !booking) {
        return (
            <CardSkeleton loadingTitle={loadingTitle}/>
        )
    }

    const totalStatusCount = Object.values(category.statusCount).reduce((a, b) => a + b, 0)
    const pendingCount = Math.max(0, category.totalVouchers - totalStatusCount)



    return (
        <Card className="w-full p-0 shadow-md hover:cursor-pointer hover:bg-slate-100 hover:shadow-lg transform transition-transform duration-200 hover:scale-[1.01]">
            <div className="flex flex-row justify-between gap-3 items-center p-3">
                <div className="text-[15px] text-zinc-900 font-semibold">{category.title}</div>
                {category.totalVouchers > 0 && (
                    <Badge variant="default" className="bg-primary-green bg-opacity-70">
                        {category.totalVouchers} Vouchers
                    </Badge>
                )}
            </div>
            <CardContent className="px-3 pb-3 flex flex-col justify-center">
                <div className="w-full flex flex-row justify-between items-center">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-0">
                        <StatusBadge
                            count={category.statusCount.inprogress + category.statusCount.amended}
                            label="In Progress"
                            color="text-yellow-500"
                        />
                        <StatusBadge count={category.statusCount.sentToClient} label="Sent to Vendor" color="text-blue-500" />
                        <StatusBadge count={category.statusCount.vendorConfirmed} label="Vendor Confirmed" color="text-green-500" />
                        <StatusBadge count={category.statusCount.cancelled} label="Cancelled" color="text-red-500" />
                    </div>
                    <div className="-mt-4 transform transition-transform duration-200 hover:scale-[1.05]">
                        {booking.status !== "cancelled" ? (
                            <Link href={`${pathname}/${booking.id}/edit?tab=${tab ?? 'general'}`}>
                                <ArrowRightCircleIcon size={28} className="text-gray-400 font-thin hover:bg-slate-200 rounded-full shadow-lg" />
                            </Link>
                        ) : (
                            <Link href={`${pathname}/${booking.id}/tasks?tab=${tab ?? 'general'}`}>
                                <ArrowRightCircleIcon size={28} className="text-gray-400 font-thin hover:bg-slate-200 rounded-full shadow-lg" />
                            </Link>
                        )}
                    </div>
                </div>
            </CardContent>
            {category.locked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-700 bg-opacity-50">
                    <Lock className="text-white" size={32} />
                </div>
            )}
        </Card>
    )
}

const CardSkeleton = ({loadingTitle}:{loadingTitle:string | undefined}) => (
    <Card className="max-h-[115px] w-full relative p-0 shadow-md m-0">
      <div className="flex flex-row justify-between gap-3 items-center p-3">
      <div className="text-[15px] text-zinc-900 font-semibold">{loadingTitle}</div>
        <Skeleton className="h-4 w-1/4" />
      </div>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="h-6 w-12 mb-1" />
              <Skeleton className="h-2 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

export default RenderCard

