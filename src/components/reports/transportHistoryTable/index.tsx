import TransportHistoryTable from "./transportHistoryTable";

const TransportHistoryTab = () => {
  return (
    <div className="mx-9 flex flex-row justify-center gap-2">
      <div className="card w-[100%] space-y-6">
        <div className="card-title">Transport History</div>
        <TransportHistoryTable />
      </div>
    </div>
  );
};

export default TransportHistoryTab;
