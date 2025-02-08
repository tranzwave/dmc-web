'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Check, Zap, Star, Crown } from 'lucide-react'
import { Package } from '~/lib/types/payment'
import PaymentButton from './PaymentButton'
import { packages } from '~/lib/constants'


export default function EnhancedPaymentPackages() {
  
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(packages[0] ?? null)

  useEffect(() => {
    if(packages.length > 0) {
      setSelectedPackage(packages[0] ?? null)
    }
  }
  , [packages])

  return (
    <div className="p-8 w-[520px] h-[600px] mx-auto">
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-2xl overflow-hidden">
        <Tabs defaultValue={packages[0]?.tabValue} className="w-full" onValueChange={(value) => setSelectedPackage(packages.find(pkg => pkg.tabValue === value)! ?? packages[0])}>
          <TabsList className="grid rounded-md w-full grid-cols-4 bg-gray-100 p-1 gap-1">
            {packages.map((pkg) => (
              <TabsTrigger
                key={pkg.id}
                value={pkg.tabValue}
                className="data-[state=active]:bg-white data-[state=active]:text-[#287f71] data-[state=active]:shadow-md transition-all duration-200 border-none"
                icon={<pkg.icon className="w-4 h-4 mr-1" />}
              >
                {pkg.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {packages.map((pkg) => (
            <TabsContent key={pkg.id} value={pkg.tabValue} className="border-none p-4 h-[450px]">
              <Card className="border-none shadow-none bg-transparent flex flex-col h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold flex items-center">
                    <pkg.icon className="w-6 h-6 mr-2 text-[#287f71]" />
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-sm">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-[#287f71]">${pkg.price}</span>
                    <span className="text-gray-600 ml-1">/ month</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-700">
                        <Check className="w-4 h-4 mr-2 text-[#287f71] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4 w-full mt-auto">
                  {selectedPackage && (
                    <PaymentButton selectedPackage={selectedPackage} />
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <p className="text-center mt-6 text-sm text-gray-600">
        {/* All plans come with a 30-day money-back guarantee. */}
      </p>
    </div>
  )
}

