import { DataTable } from "~/components/bookings/home/dataTable";
import { columns } from "./columns";

const TransportHistoryTable = () => {
  return (
    <div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export default TransportHistoryTable;
