import { Suspense } from "react"
import { Skeleton } from "~/components/ui/skeleton"
import SubscriptionManager from "./subscriptionManager"

export default function SubscriptionPage() {
  return (
    <div className="">
      {/* <h1 className="card-title">Manage Your Subscription</h1> */}
      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionManager />
      </Suspense>
    </div>
  )
}

function SubscriptionSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

