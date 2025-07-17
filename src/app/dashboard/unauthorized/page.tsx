"use client"
import Link from "next/link"
import { Shield, Mail, LockIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { useSearchParams } from "next/navigation"

export default function Unauthorized() {

  const searchParams = useSearchParams();
  const requestedPath = searchParams.get('requestedPage');
  const requiredPermissions = searchParams.get('requiredPermissions');
  const parsedPermissions = requiredPermissions ? JSON.parse(requiredPermissions) as string[] : [];
  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <LockIcon className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription className="text-gray-500">You don't have permission to access this page</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-[14px]">
          <p className="mb-4 text-gray-600">
            You are trying to access <strong>{requestedPath}</strong>, but your account does not have the necessary
            permissions.
          </p>
          <p className="mb-4 text-gray-600">
            Please contact your
            administrator to grant you <strong>{parsedPermissions.join(" ,")}</strong> access.
          </p>
        </CardContent>
        {/* <CardFooter className="flex flex-col gap-2">
          <Button className="w-full gap-2 bg-[#287f71] hover:bg-[#1e6358]">
            <Mail className="h-4 w-4" />
            Contact Administrator
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full text-[#287f71] border-[#287f71] hover:bg-[#e7f5f3]">
              Return to Home
            </Button>
          </Link>
        </CardFooter> */}
      </Card>
    </div>
  )
}

