import { ConfirmationForm } from "~/components/common/tasksTab/confirmationForm";
import { VoucherConfirmationDetails } from "~/lib/types/booking";

const ConfirmationContent = (
    selectedVoucher: any,
    updateVoucherStatus: (selectedVoucher:any,confirmationDetails?: VoucherConfirmationDetails) => Promise<boolean>,
  ) => {
    if (!selectedVoucher?.status) {
      return (
        <div>
          <p>Please select a voucher</p>
        </div>
      );
    }
    if (selectedVoucher?.status === "sentToVendor" || selectedVoucher?.status === "vendorConfirmed") {
      return (
        <div className="space-y-6">
          <ConfirmationForm
            selectedVoucher={selectedVoucher}
            updateVoucherStatus={updateVoucherStatus}
          />
        </div>
      );
    } else if (selectedVoucher?.status === "inprogress") {
      return (
        <div>
          <p>Click Proceed and send voucher first</p>
        </div>
      );
    } else {
      return <div>You have already confirmed the voucher</div>;
    }
  };

  export default ConfirmationContent;