"use client";
import {
  Activity,
  BarChart2,
  Building,
  Calendar,
  Car,
  Home,
  User,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNavBar = () => {
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Overview",
      path: "/overview",
      icon: <Home className="icon-size" />,
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: <Calendar className="icon-size" />,
    },
    {
      name: "Hotels",
      path: "/hotels",
      icon: <Building className="icon-size" />,
    },
    // { name: 'Restaurants', path: '/restaurants', icon: <Utensils className='icon-size'/> },

    {
      name: "Transport",
      path: "/transport",
      icon: <Car className="icon-size" />,
    },
    {
      name: "Activities",
      path: "/activities",
      icon: <Activity className="icon-size" />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart2 className="icon-size" />,
    },
    { name: "Agents", path: "/agents", icon: <User className="icon-size" /> },
  ];

  return (
    <div className="flex h-full flex-col gap-4 bg-primary-green text-white">
      {/* Logo Section */}
      <div className="mb-2 flex items-center justify-center p-4">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={145} // Adjust the width as per your requirement
          height={39} // Adjust the height as per your requirement
          className="h-auto w-auto"
        />
      </div>
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto">
        <div className="flex flex-col justify-evenly">
          {navLinks.map((link) => (
            <Link key={link.name} href={`/dashboard` + link.path}>
              <div
                className={`base-text my-1 flex items-center rounded-lg px-4 py-2 font-medium transition-colors 2xl:my-2 2xl:py-3 ${
                  pathname.includes(link.path)
                    ? "bg-white text-primary-green"
                    : "hover:bg-slate-100 hover:text-primary-green"
                }`}
              >
                <div className="mr-2">{link.icon}</div>
                {link.name}
              </div>
            </Link>
          ))}

        </div>
      </nav>
      {/* Contact Us Section */}
      <div className="mb-8 w-full rounded-lg border-t bg-white p-4">
        <div className="base-text mb-3 font-medium text-primary-green">
          <div>Developed By</div>
          <div>Tranzwave System</div>
        </div>
        <div className="base-text flex cursor-pointer items-center justify-center rounded-lg bg-primary-green px-4 py-2 font-medium text-white">
          Contact Now
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
