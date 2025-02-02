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
import { Menu } from 'lucide-react'
import Image from "next/image"

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#287f71]">
            <Image
              src="/assets/new-logo.png" style={{ width: '130px', height: '60px' }}
              alt="Logo"
              width={130} // Adjust the width as per your requirement
              height={60} // Adjust the height as per your requirement
            />
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link href="#features" className="text-lg font-medium">
                  Features
                </Link>
                <Link href="#pricing" className="text-lg font-medium">
                  Pricing
                </Link>
                <Link href="#about" className="text-lg font-medium">
                  About
                </Link>
                <Link href="#contact" className="text-lg font-medium">
                  Contact
                </Link>
                <Link href="/dashboard/overview">
                  <Button className="w-full bg-[#287f71] hover:bg-[#287f71]/90">
                    Get Started
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px]">
                      <div className="grid grid-cols-2 gap-4">
                        <Link
                          href="#features"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md p-4 hover:bg-muted"
                        >
                          <div className="text-sm font-medium group-hover:underline">Guest Management</div>
                          <div className="line-clamp-2 text-sm text-muted-foreground">
                            Streamline your guest experience from start to finish
                          </div>
                        </Link>
                        <Link
                          href="#features"
                          className="group grid h-auto w-full items-center justify-start gap-1 rounded-md p-4 hover:bg-muted"
                        >
                          <div className="text-sm font-medium group-hover:underline">Booking System</div>
                          <div className="line-clamp-2 text-sm text-muted-foreground">
                            Efficient and automated booking management
                          </div>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="#pricing" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="#about" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="#contact" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link href="/dashboard/overview">
              <Button className="w-full bg-[#287f71] hover:bg-[#287f71]/90">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

