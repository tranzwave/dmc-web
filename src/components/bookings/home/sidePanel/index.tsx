"use client"

import { Booking, CategoryDetails } from "~/components/bookings/home/columns";
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { Lock } from "lucide-react"; // Import the lock icon

interface SidePanelProps {
  booking: Booking | null;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ booking, onClose }) => {
  if (!booking) return (
    <div className="flex justify-center items-center">
        Please click on a row
    </div>
  );

  const renderCard = (category: CategoryDetails) => (
    <div className='relative card gap-3'>
      <div className='text-base font-semibold text-primary-black'>{category.title}</div>
      <div className='flex flex-row gap-3'>
        <div className='flex flex-col gap-4 w-4/5'>
          <div>
            <div className='text-sm text-[#21272A] font-normal'>
              {category.vouchersToFinalize} Vouchers to finalize
            </div>
            <div>
              <Progress value={((category.done / category.totalVouchers) * 100)} className='h-2' />
            </div>
          </div>
          <div>
            <div className='text-sm text-[#21272A] font-normal'>
              {category.done} done | {category.totalVouchers - category.done} vouchers to confirm
            </div>
            <div>
              <Progress value={((category.done / category.totalVouchers) * 100)} className='h-2' />
            </div>
          </div>
        </div>
        <div className='w-1/5'>
          <div className='flex items-end justify-end h-full'>
            <Button variant={'outline'}>Proceed</Button>
          </div>
        </div>
      </div>
      {category.locked && (
        <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center rounded-lg">
          <Lock className="text-white" size={32} />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-auto border border-primary-borderGray shadow-md rounded-lg card gap-4">
      <div className='flex flex-row justify-between items-center'>
        <div className='card-title'>
          Booking - {booking.id}
        </div>
        <Button variant={'primaryGreen'}>Summary</Button>
      </div>
      <div className='grid grid-cols-3 rounded-lg shadow-sm'>
        <div>
        </div>
      </div>
      {renderCard(booking.details.hotels)}
      {renderCard(booking.details.transport)}
      {renderCard(booking.details.activities)}
      {renderCard(booking.details.shops)}
    </div>
  );
};

export default SidePanel;
