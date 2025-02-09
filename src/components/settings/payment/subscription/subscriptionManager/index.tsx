"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { useEffect, useState } from "react"
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
    <div className="space-y-4">
      <UpgradePlan organization={organization}/>
      <BillingHistory billingHistory={billingHistory} organization={organization} isLoading={loadingBillingHistory}/>
      {/* <UpdateCardForm organization={organization}/> */}
      <CancelSubscription organization={organization}/>
    </div>
  )
}

function BillingHistory({ billingHistory,organization, isLoading }:BillingHistoryProps) {
  // const [subscriptionId, setSubscriptionId] = useState<string | null>(null)
  // const [billingHistory, setBillingHistory] = useState<any[]>([])

  // useEffect(() => {
  //   async function fetchSubscriptionData() {
  //     const subscriptionData = await getOrganizationSubscriptionData(organization.id)
  //     setSubscriptionId(subscriptionData.subscription_id)
  //   }
  //   fetchSubscriptionData()
  // }, [organization.id])

  // const fetcher = (url: string) => fetch(url).then((res) => res.json())

  // const { data, error } = useSWR(subscriptionId ? `/api/payhere/subscription/${subscriptionId}` : null, fetcher)

  // if (error) return <div>Failed to load</div>
  // if (!data) return <div>Loading...</div>

  // setBillingHistory(data.payments as any[])
  // console.log(data)

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

function UpdateCardForm({organization}:UpdateCardFormProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event:any) => {
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

function CancelSubscription({organization}:CancelSubscriptionProps) {
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

function UpgradePlan({organization}:UpgradePlanProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const { toast } = useToast()

  const handleUpgrade = async (event:any) => {
    event.preventDefault()
    setIsUpgrading(true)
    try {
      await upgradePlan(selectedPlan)
      toast({
        title: "Plan Upgraded",
        description: `Your subscription has been upgraded to the ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="card-title">Activated Plan</CardTitle>
        <CardDescription>You can update the subscription plan here</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <form onSubmit={handleUpgrade}>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="flex items-center space-x-2">
                <RadioGroupItem value={pkg.name} id={pkg.id.toString()} />
                <Label htmlFor={pkg.name}>{pkg.name} - ${pkg.price}/month</Label>
              </div>
            ))}
          </RadioGroup>
          <Button variant={"primaryGreen"} type="submit" className="mt-4" disabled={isUpgrading}>
            {isUpgrading ? "Upgrading..." : "Upgrade Plan"}
          </Button>
        </form> */}
        <div className="text-[14px] text-zinc-800">You are on {(organization.publicMetadata as ClerkOrganizationPublicMetadata).subscription.plan} Plan</div>
        {/* <Button variant={"primaryGreen"} type="submit" className="mt-4" disabled={isUpgrading}>
            {isUpgrading ? "Upgrading..." : "Upgrade Plan"}
        </Button> */}
        <PaymentDialog />
      </CardContent>
    </Card>
  )
}

