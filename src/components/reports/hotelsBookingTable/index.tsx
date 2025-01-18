import HotelsBookingTable from "./hotelsBookingTable";

const HotelsBookingTab = () => {
  return (
    <div className="mx-9 flex flex-row justify-center gap-2">
      <div className="card w-[100%] space-y-6">
        <div className="card-title">Hotels Bookings History</div>
        <HotelsBookingTable />
      </div>
    </div>
  );
};

export default HotelsBookingTab;
