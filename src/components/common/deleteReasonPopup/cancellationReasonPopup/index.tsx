import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from 'src/components/ui/alert-dialog';
import { Button } from 'src/components/ui/button';

type CancellationReasonPopupProps = {
  itemName: string; // The name of the voucher or item
  cancellationReason: string; // The reason for cancellation
  isOpen: boolean; // Controls modal visibility
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; // State setter to update modal state
};

const CancellationReasonPopup: React.FC<CancellationReasonPopupProps> = ({ itemName, cancellationReason, isOpen, setIsOpen }) => {
  return (
    <div>
      {/* Control the open state using the `isOpen` prop */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Modal Content */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancellation Reason</AlertDialogTitle>
            <AlertDialogDescription>
              The voucher <span className="font-bold">{itemName}</span> has been cancelled. Here's the reason:
              <div className="mt-2 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-zinc-700">{cancellationReason}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Footer with only the OK button */}
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction asChild>
              <Button
                variant="outline"
                className="bg-gray-200 text-black hover:bg-gray-300"
                onClick={() => setIsOpen(false)} // Close the modal when "OK" is clicked
              >
                OK
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CancellationReasonPopup;
