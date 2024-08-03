'use client'
import { Car, Home, Book, Activity, Users, Notebook } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Service = {
  icon: JSX.Element;
  title: string;
};

const services: Service[] = [
  { icon: <Car size={50} color='#636363' />, title: 'Transport' },
  { icon: <Home size={50} color='#636363' />, title: 'Hotels' },
  { icon: <Book size={50} color='#636363' />, title: 'Bookings' },
  { icon: <Activity size={50} color='#636363' />, title: 'Activities' },
  { icon: <Notebook size={50} color='#636363' />, title: 'Reports' },
  { icon: <Users size={50} color='#636363' />, title: 'Agents' },
];

const Services = () => {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service, index) => (
        <Link key={index} href={`/dashboard/${service.title.toLowerCase()}`} passHref>
          <Card icon={service.icon} title={service.title} />
        </Link>
      ))}
    </div>
  );
};

type CardProps = {
  icon: JSX.Element;
  title: string;
};

const Card: React.FC<CardProps> = ({ icon, title }) => {
  return (
    <div className="border flex flex-col justify-center items-center p-4 rounded-lg aspect-square cursor-pointer hover:bg-[#d1ffe1] hover:border-[#287f71] shadow-md">
      <div>{icon}</div>
      <div className="mt-2 text-center text-lg font-medium text-[#636363]">{title}</div>
    </div>
  );
};

export default Services;
