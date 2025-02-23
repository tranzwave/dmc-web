"use cleint"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { ArrowRightCircleIcon, Lock } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

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

export const RenderCard = ({ category, booking, pathname }: RenderCardProps) => {

    useEffect(() => {
        console.log("category", category)
    }
    , [booking])

    
    if (!category || !booking) {
        return null // or return a placeholder/loading state
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
                            <Link href={`${pathname}/${booking.id}/edit?tab=${category.title.toLowerCase().split(' ')[0]}s`}>
                                <ArrowRightCircleIcon size={28} className="text-gray-400 font-thin hover:bg-slate-200 rounded-full shadow-lg" />
                            </Link>
                        ) : (
                            <Link href={`${pathname}/${booking.id}/tasks?tab=${category.title.toLowerCase().split(' ')[0]}s`}>
                                <ArrowRightCircleIcon size={28} className="text-gray-400 font-thin hover:bg-slate-200 rounded-full shadow-lg" />
                            </Link>
                        )}
                    </div>
                </div>
            </CardContent>
            {/* <CardFooter className="flex justify-end gap-2 px-3 p-3">
            {booking.status !== "cancelled" && (
                <Link href={`${pathname}/${booking.id}/edit?tab=${category.title.toLowerCase()}`}>
                <Button variant="outline">Add Vouchers</Button>
                </Link>
            )}
            <Link href={`${pathname}/${booking.id}/tasks?tab=${category.title.toLowerCase()}`}>
                <Button variant="outline">Send Vouchers</Button>
            </Link>
            </CardFooter> */}
            {category.locked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-700 bg-opacity-50">
                    <Lock className="text-white" size={32} />
                </div>
            )}
        </Card>
    )
}

export default RenderCard

