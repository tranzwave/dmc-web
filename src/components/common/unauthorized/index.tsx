"use client"

import { LockIcon } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { cn } from "~/lib/utils"
import { useState, useEffect } from "react"

interface UnauthorizedCardProps {
  activity: string
  requiredPermissions?: string[]
}

const UnauthorizedCard = ({ activity, requiredPermissions }: UnauthorizedCardProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <Card
      className={cn(
        "max-w-md w-full mx-auto border border-red-100 shadow-md transition-all duration-500",
        isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-4",
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <LockIcon className="h-8 w-8 text-red-400" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>

        <p className="text-gray-600 mb-6 text-[14px]">
          You don't have permission to {activity}.
          <br />
          Please ask your admin to grant you <strong>{requiredPermissions?.join(", ")}</strong> access.
        </p>

        {/* <div className="w-full max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-red-300 h-full w-1/3 animate-pulse rounded-full"></div>
        </div> */}
      </CardContent>
    </Card>
  )
}

export default UnauthorizedCard
