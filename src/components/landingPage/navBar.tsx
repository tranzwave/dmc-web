'use client'

import Link from "next/link"
import { Button } from "~/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import { Calendar, MapPin, Menu, Users } from 'lucide-react'
import Image from "next/image"

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative overflow-hidden rounded-xl">
              {/* <Image
                src="/assets/new-logo.png" 
                style={{ width: '130px', height: '60px' }}
                width={130}
                height={60}
                alt="Travel Logo"
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              /> */}
              <Image
                src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=130&h=60&fit=crop"
                alt="Travel Logo"
                width={50}
                height={50}
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-5xl font-extrabold bg-gradient-to-r from-[#287f71] to-[#2dd4bf] bg-clip-text text-transparent">
              COORD.TRAVEL
            </span>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full w-11 h-11 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 transition-all duration-300"
              >
                <Menu className="h-5 w-5 text-gray-700" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-xl border-l border-white/20">
              <div className="mt-8">
                <nav className="flex flex-col gap-1">
                  <div className="mb-6">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Navigation
                    </h3>
                  </div>

                  <Link
                    href="#features"
                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200 mx-2"
                  >
                    <MapPin className="h-5 w-5 text-[#287f71]" />
                    Features
                  </Link>

                  <Link
                    href="#pricing"
                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200 mx-2"
                  >
                    <Calendar className="h-5 w-5 text-[#287f71]" />
                    Pricing
                  </Link>

                  <Link
                    href="/contact-us"
                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200 mx-2"
                  >
                    <Users className="h-5 w-5 text-[#287f71]" />
                    Contact
                  </Link>

                  <div className="mt-8 px-2">
                    <Link href="/dashboard/overview">
                      <Button className="w-full h-12 bg-gradient-to-r from-[#287f71] to-[#2dd4bf] hover:from-[#1e6b5c] hover:to-[#14b8a6] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[0.98]">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-white/10 rounded-full px-6 py-2 font-medium text-gray-700 transition-all duration-200 border border-transparent hover:border-white/20">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl">
                    <div className="grid gap-3 p-8 w-[520px]">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Travel Features</h4>
                        <p className="text-sm text-gray-600">Everything you need for seamless travel planning</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          href="#features"
                          className="group flex flex-col gap-2 rounded-xl p-4 hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-white/30"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#287f71]" />
                            <span className="font-semibold text-gray-900 group-hover:text-[#287f71] transition-colors">Guest Management</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Streamline your guest experience from start to finish with our comprehensive management tools
                          </p>
                        </Link>
                        <Link
                          href="#features"
                          className="group flex flex-col gap-2 rounded-xl p-4 hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-white/30"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#287f71]" />
                            <span className="font-semibold text-gray-900 group-hover:text-[#287f71] transition-colors">Booking System</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Efficient and automated booking management with real-time availability and instant confirmations
                          </p>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/#pricing" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:text-gray-900 focus:outline-none border border-transparent hover:border-white/20 text-gray-700">
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/contact-us" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 focus:bg-white/10 focus:text-gray-900 focus:outline-none border border-transparent hover:border-white/20 text-gray-700">
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-4">
              <Link href="/dashboard/overview">
                <Button className="h-11 px-8 bg-gradient-to-r from-[#287f71] to-[#2dd4bf] hover:from-[#1e6b5c] hover:to-[#14b8a6] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[0.98] border-0">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

