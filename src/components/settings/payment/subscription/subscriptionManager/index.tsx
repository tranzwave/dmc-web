"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { act, useEffect, useState } from "react"
import { cancelSubscription, getBillingHistory, updateCard, upgradePlan } from "~/lib/utils/paymentUtils"
import { useToast } from "~/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { packages } from "~/lib/constants"
import { OrganizationResource } from "@clerk/types"
import { useOrganization } from "@clerk/nextjs"
import LoadingLayout from "~/components/common/dashboardLoading"
import { ClerkOrganizationPublicMetadata } from "~/lib/types/payment"
import PaymentButton from "~/components/payment/PaymentButton"
import PaymentDialog from "~/components/payment/modal"
import useSWR from "swr"
import { getOrganizationSubscriptionData } from "~/server/auth"
import { Badge } from "~/components/ui/badge"
import { Check } from "lucide-react"
import { sub } from "date-fns"

type BillingHistoryItem = {
  date: string
  amount: string
  description: string
}

interface BillingHistoryProps {
  billingHistory: BillingHistoryItem[]
  organization: OrganizationResource,
  isLoading?: boolean
}

interface UpgradePlanProps {
  organization: OrganizationResource
}

interface UpdateCardFormProps {
  organization: OrganizationResource
}

interface CancelSubscriptionProps {
  organization: OrganizationResource
}



export default function SubscriptionManager() {
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([])
  const { organization, isLoaded } = useOrganization()
  const [loadingBillingHistory, setLoadingBillingHistory] = useState(false)

  useEffect(() => {
    async function fetchBillingHistory() {
      setLoadingBillingHistory(true)
      const history = await getBillingHistory(organization?.id ?? "")
      setLoadingBillingHistory(false)
      setBillingHistory(history)
    }
    fetchBillingHistory()
  }, [])

  if (!isLoaded || !organization) {
    return <LoadingLayout />
  }
  return (
    <div className="w-full flex flex-row gap-4 h-full">
      <div className="w-full max-w-lg flex flex-col gap-4 h-full">
      <UpgradePlan organization={organization} />
      <CancelSubscription organization={organization} />
      </div>
      <div className="w-full h-full">
      <BillingHistory billingHistory={billingHistory} organization={organization} isLoading={loadingBillingHistory} />
      </div>
    </div>
  )
}

function BillingHistory({ billingHistory, organization, isLoading }: BillingHistoryProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="card-title">Billing History</CardTitle>
        <CardDescription>View your recent billing transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>Loading...</TableCell>
              </TableRow>
            )}
            {billingHistory.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function UpdateCardForm({ organization }: UpdateCardFormProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setIsUpdating(true)
    try {
      const formData = new FormData(event.target)
      await updateCard(formData)
      toast({
        title: "Card Updated",
        description: "Your card has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="card-title">Update Card</CardTitle>
        <CardDescription>Change your payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" name="cvv" placeholder="123" required />
          </div>
          <Button variant={"primaryGreen"} type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Card"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function CancelSubscription({ organization }: CancelSubscriptionProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await cancelSubscription(organization.id)
        toast({
          title: "Subscription Cancelled",
          description: "Your subscription has been successfully cancelled.",
        })
        window.location.reload()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel subscription. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
        
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="card-title">Cancel Subscription</CardTitle>
        <CardDescription>Permanently cancel your subscription</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" onClick={handleCancel} disabled={isDeleting}>
          {isDeleting ? "Cancelling..." : "Cancel Subscription"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function UpgradePlan({ organization }: UpgradePlanProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const { toast } = useToast()
  const activeSubscription = (organization.publicMetadata as ClerkOrganizationPublicMetadata).subscription
  console.log("activeSubscription", activeSubscription)
  const subscription = packages.find((p) => p.name === activeSubscription.plan)

  if(!subscription) {
    if(activeSubscription.plan.toLowerCase() === "free") {
      return (
        <Card>
                    <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="card-title flex flex-row gap-2 items-center">
                  <div>
                    Current Plan
                  </div>
                  <div className="flex justify-center items-center text-[10px] h-6 px-2 font-semibold rounded-full border border-zinc-400">
                    <span>FREE</span>
                  </div>
                </CardTitle>
                <CardDescription>You are currently on free plan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PaymentDialog />
          </CardContent>
        </Card>
      )
  } else if (activeSubscription.plan.toLowerCase() === "none") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="card-title">Upgrade Plan</CardTitle>
          <CardDescription>Upgrade your plan to unlock more features</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentDialog />
        </CardContent>
      </Card>
    )
  }
}

  return (
    <div>
      {subscription ? (
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="card-title flex flex-row gap-2 items-center">
                  <div>
                    Current Plan
                  </div>
                  <div className="flex justify-center items-center text-[10px] h-6 px-2 font-semibold rounded-full border border-zinc-400">
                    <span>
                      {subscription.name.toUpperCase()}
                    </span>
                  </div>
                </CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-sm font-bold">
                  ${subscription.price}/{subscription.recurrence.toLowerCase().slice(2)}
                </span>
              </div>

            </div>
          </CardHeader>
          <CardContent className="grid gap-1">
            <div>
              {/* <h3 className="mb-2 text-[14px] font-medium">Features</h3> */}
              <ul className="grid gap-0 text-[13px]">
                {subscription.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary-green" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-4">
              <PaymentDialog />
            </div>
          </CardContent>
        </Card>

      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="card-title">Activated Plan</CardTitle>
            <CardDescription>Uh Oh! We are unable to detect your subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-[14px] text-zinc-800">Please contact support to resolve this issue</p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}

