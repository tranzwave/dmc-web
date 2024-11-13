import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from 'src/components/ui/alert-dialog';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input'; // Assuming you have an Input component

type DeleteReasonPopupProps = {
  itemName: string;
  onDelete: (reason: string) => void; // Function to execute on delete with reason
  isOpen: boolean; // State value to control the modal's visibility
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; // State setter to update the modal state
  isDeleting: boolean;
  description?: string;
};

const DeleteReasonPopup: React.FC<DeleteReasonPopupProps> = ({ itemName, onDelete, isOpen, setIsOpen, isDeleting, description }) => {
  const [deleteReason, setDeleteReason] = useState<string>(''); // State to capture the delete reason
  const [error, setError] = useState<string | null>(null); // State to track if there's an error (e.g., reason is empty)

  const handleDelete = () => {
    if (!deleteReason) {
      setError('Please provide a reason for deletion.');
      return;
    }
    onDelete(deleteReason);
    setIsOpen(false); // Close the modal after deletion
    setDeleteReason(''); // Reset the input field after deletion
  };

  return (
    <div>
      {/* Control the open state using the `isOpen` prop */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Modal Content */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-bold">{itemName}</span>? This action cannot be undone.
              <div className="mt-2">
                {description ? (
                  <div className="text-xs font-normal text-zinc-600">
                    {description}
                  </div>
                ) : null}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Input field for deletion reason */}
          <div className="mt-4">
            <label htmlFor="deleteReason" className="block text-sm font-medium text-gray-700">
              Reason for deletion
            </label>
            <Input
              id="deleteReason"
              type="text"
              placeholder="Enter your reason here"
              value={deleteReason}
              onChange={(e) => {
                setDeleteReason(e.target.value);
                setError(null); // Reset the error when the user starts typing
              }}
              className="mt-1 w-full"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <AlertDialogFooter className="mt-4">
            {/* Cancel Button */}
            <AlertDialogCancel asChild>
              <Button variant="outline" className="mr-2" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </AlertDialogCancel>

            {/* Confirm Delete Button */}
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={!deleteReason || isDeleting} // Disable until reason is provided
              >
                {isDeleting ? (
                  <div className="flex flex-row gap-1">
                    <LoaderCircle size={15} />
                    <div>Deleting</div>
                  </div>
                ) : (
                  'Delete'
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteReasonPopup;
