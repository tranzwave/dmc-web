import { LoaderCircle } from 'lucide-react';
import React from 'react';
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

type DeletePopupProps = {
  itemName: string;
  onDelete: () => void; // Function to execute on delete
  isOpen: boolean; // State value to control the modal's visibility
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; // State setter to update the modal state
  isDeleting:boolean
  description?: string
  cancel?:boolean
};

const DeletePopup: React.FC<DeletePopupProps> = ({ itemName, onDelete, isOpen, setIsOpen, isDeleting,description,cancel }) => {
  return (
    <div>
      {/* Control the open state using the `isOpen` prop */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Modal Content */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {cancel ? 'cancel' : 'delete'} <span className="font-bold">{itemName}</span>? This action cannot be undone.
              <div className='mt-2'>
                {description ? (<div className='text-xs font-normal text-zinc-600'>
                  {description}
                </div>):('')}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* Cancel Button */}
            <AlertDialogCancel asChild>
              <Button variant="outline" className="mr-2" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </AlertDialogCancel>
            
            {/* Confirm Delete Button */}
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (<div className='flex flex-row gap-1'><LoaderCircle size={15}/><div>Deleting</div></div>): `${cancel ? 'Cancel' : 'Delete'}`}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeletePopup;
