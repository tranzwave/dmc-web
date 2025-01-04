"use client";
import {
  Activity,
  BarChart2,
  Building,
  Calendar,
  Car,
  Home,
  Store,
  User,
  Utensils
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
    { name: 'Restaurants', path: '/restaurants', icon: <Utensils className='icon-size'/> },

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
      name: "Shops",
      path: "/shops",
      icon: <Store className="icon-size" />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <BarChart2 className="icon-size" />,
    },
    { name: "Agents", path: "/agents", icon: <User className="icon-size" /> },
    // { name: "Admin", path: "/admin", icon: <User2 className="icon-size" /> },

  ];

  return (
    <div className="flex h-full flex-col gap-4 bg-primary-green text-white">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/assets/coord-white-logo-new.svg" style={{ width: '130px', height: '60px' }}
          alt="Logo"
          width={130} // Adjust the width as per your requirement
          height={60} // Adjust the height as per your requirement
        />
        {/* <div className="font-semibold">COORD.TRAVEL</div> */}
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
      <div className="w-full rounded-lg border-t bg-white px-4 py-2 -mb-3">
        <div className="base-text mb-3 font-medium text-primary-green">
          <div>Developed By</div>
          <div>COORD.TRAVEL</div>
        </div>
        <div className="base-text flex cursor-pointer items-center justify-center rounded-lg bg-primary-green px-4 py-2 font-medium text-white">
          Contact Now
        </div>
      </div>
      <div className="w-full flex justify-start items-center">
        <div className="text-[10px]">v1.0.0</div>
      </div>
    </div>
  );
};

export default SideNavBar;
