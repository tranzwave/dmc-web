'use client'
import { Activity, BarChart2, Building, Calendar, Car, Home, User, Utensils } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideNavBar = () => {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Overview', path: '/overview', icon: <Home className='icon-size' /> },
        { name: 'Bookings', path: '/bookings', icon: <Calendar className='icon-size'/> },
        { name: 'Hotels', path: '/hotels', icon: <Building className='icon-size'/> },
        { name: 'Restaurants', path: '/restaurants', icon: <Utensils className='icon-size'/> },
        { name: 'Transport', path: '/transport', icon: <Car className='icon-size'/> },
        { name: 'Activities', path: '/activities', icon: <Activity className='icon-size'/> },
        { name: 'Reports', path: '/reports', icon: <BarChart2 className='icon-size'/> },
        { name: 'Agents', path: '/agents', icon: <User className='icon-size'/> },
    ];

    return (
        <div className="flex flex-col h-screen bg-primary-green text-white gap-4">
            {/* Logo Section */}
            <div className="flex items-center justify-center mb-2 p-4">
                <Image 
                    src="/assets/logo.png" 
                    alt="Logo" 
                    width={145} // Adjust the width as per your requirement
                    height={39} // Adjust the height as per your requirement
                    className="w-auto h-auto"
                />
            </div>
            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto">
                <div className='flex flex-col justify-evenly'>
                    {navLinks.map((link) => (
                        <Link key={link.name} href={`/dashboard` + link.path}>
                            <div
                                className={`flex items-center px-4 py-2 2xl:py-3 my-1 2xl:my-2 rounded-lg transition-colors font-medium base-text ${
                                    pathname.includes(link.path)
                                        ? 'bg-white text-primary-green'
                                        : 'hover:bg-slate-100 hover:text-primary-green'
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
            <div className="w-full rounded-lg p-4 border-t bg-white mb-8">
                <div className='text-primary-green font-medium base-text mb-3'>
                    <div>Developed By</div>
                    <div>Tranzwave System</div>
                </div>
                <div className='cursor-pointer px-4 py-2 flex items-center justify-center bg-primary-green text-white font-medium base-text rounded-lg'>Contact Now</div>
            </div>
        </div>
    );
};

export default SideNavBar;
