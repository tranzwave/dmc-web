/**
 * Navigation Bar
 *
 * @update 8/10/2025
 */
'use client'

import Link from "next/link"
import Image from "next/image"
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
import { Menu, MapPin, Calendar, Users, Settings, Sparkles, ClipboardList } from 'lucide-react'

export function Navbar() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full sm:w-[90%] md:w-[80%] lg:w-[75%] z-[50] bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-2xl border-b border-white/30 shadow-lg rounded-b-3xl">
      <div className="container mx-0 px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={"/"}
            onClick={() => {
              if (window.location.hash) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
              window.location.reload();
            }}
            className="flex items-center space-x-2 group"
          >
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src="/assets/new-logo.png"
                style={{ width: '130px', height: '60px' }}
                width={130}
                height={60}
                alt="Travel Logo"
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* <span className="text-4xl font-extrabold bg-gradient-to-r from-[#287f71] to-[#2dd4bf] bg-clip-text text-transparent">
              COORD.TRAVEL
            </span> */}
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
                      COORD.TRAVEL
                    </h3>
                  </div>

                  <div className="mx-2 ml-0">
                    <div className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200 mx-2">
                      <Sparkles className="h-5 w-5 text-[#287f71]" />
                      Features
                    </div>
                    <div className="pl-4 space-y-1 ml-6">
                      <Link
                        href="#features"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-600 hover:bg-white/50 rounded-xl transition-all duration-200"
                      >
                        <ClipboardList className="h-4 w-4 text-[#287f71]" />
                        Guest Management
                      </Link>
                      <Link
                        href="#features"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-600 hover:bg-white/50 rounded-xl transition-all duration-200"
                      >
                        <Calendar className="h-4 w-4 text-[#287f71]" />
                        Booking System
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="#pricing"
                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-white/50 rounded-xl transition-all duration-200 mx-2"
                  >
                    <Settings className="h-5 w-5 text-[#287f71]" />
                    Pricing
                  </Link>

                  <Link
                    href="/contact-us"
                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-700 hover:bg-white/90 rounded-xl transition-all duration-200 mx-2"
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
                  <NavigationMenuTrigger className="bg-transparent hover:bg-white/20 hover:shadow-lg rounded-full px-6 py-2 font-medium text-gray-700 transition-all duration-200 border border-transparent hover:border-white/20">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl">
                    <div className="flex flex-col gap-3 p-8 w-[420px]">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Travel Features</h4>
                        <p className="text-sm text-gray-600">Everything you need for seamless travel planning</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href="#features"
                          className="group flex items-start gap-3 rounded-xl p-4 hover:bg-white/60 transition-all duration-200 border border-transparent hover:border-white/30"
                        >
                          <MapPin className="h-5 w-5 text-[#287f71] mt-0.5 flex-shrink-0" />
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-900 group-hover:text-[#287f71] transition-colors">Guest Management</span>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Streamline your guest experience from start to finish with our comprehensive management tools
                            </p>
                          </div>
                        </Link>
                        <Link
                          href="#features"
                          className="group flex items-start gap-3 rounded-xl p-4 hover:bg-white/60 transition-all duration-200 border border-transparent hover:border-white/30"
                        >
                          <Calendar className="h-5 w-5 text-[#287f71] mt-0.5 flex-shrink-0" />
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-900 group-hover:text-[#287f71] transition-colors">Booking System</span>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Efficient and automated booking management with real-time availability and instant confirmations
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/#pricing" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/20 hover:shadow-lg focus:bg-white/10 focus:text-gray-900 focus:outline-none border border-transparent hover:border-white/20 text-gray-700">
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/contact-us" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/20 hover:shadow-lg focus:bg-white/10 focus:text-gray-900 focus:outline-none border border-transparent hover:border-white/20 text-gray-700">
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-4">
              <Link href="/dashboard/overview">
                <Button className="h-11 px-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-[#287f71] font-semibold shadow-md hover:shadow-lg hover:bg-white/70 transition-all duration-300 transform hover:scale-[0.98]">
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
