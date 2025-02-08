import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"

interface TopBarFlagProps {
  trialEndDate: Date
}

export function TopBarFlag({ trialEndDate }: TopBarFlagProps) {
  const formattedDate = trialEndDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="free-trial-flag flex items-center justify-center bg-green-100 text-[#287f71] p-2 text-[14px] gap-3">
      <div className="flex flex-row justify-center items-center">
      <AlertCircle className="w-4 h-4 mr-2" />
      <span>Your free trial ends on {formattedDate}</span>
      </div>
      <div>
        <Link href="/dashboard/admin">
            <Button variant={"primaryGreen"} className="h-7 cursor-pointer bg-[#287f71] text-green-100">Upgrade</Button>
        </Link>
      </div>
    </div>
  )
}
