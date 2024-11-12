import { ConfirmationForm } from "~/components/common/tasksTab/confirmationForm";

const ConfirmationContent = (
    selectedVoucher: any,
    updateVoucherStatus: any,
  ) => {
    if (!selectedVoucher?.status) {
      return (
        <div>
          <p>Please select a voucher</p>
        </div>
      );
    }
    if (selectedVoucher?.status === "sentToVendor") {
      return (
        <div className="space-y-6">
          <ConfirmationForm
            selectedVoucher={selectedVoucher}
            updateVoucherStatus={updateVoucherStatus}
          />
        </div>
      );
    }
  
    if (selectedVoucher?.status === "inprogress") {
      return (
        <div>
          <p>Click Proceed and send voucher first</p>
        </div>
      );
    } else {
      return <div>You have already confirmed the voucher</div>;
    }
  };

  export default ConfirmationContent