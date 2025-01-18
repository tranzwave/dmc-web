import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "~/components/ui/dialog"; // Adjust import paths as needed

interface PopupProps {
  title: string;
  description: string;
  trigger: React.ReactNode; // Trigger element
  onConfirm: () => void;
  onCancel: () => void;
  dialogContent: React.ReactNode; // Custom content inside the dialog
  size?: "small" | "medium" | "large"; // Size options
}

const Popup: React.FC<PopupProps> = ({
  title,
  description,
  trigger,
  onConfirm,
  onCancel,
  dialogContent,
  size = "medium", // Default size
}) => {
  // Determine dialog size class based on size prop
  const sizeClass = {
    small: "w-[30%] max-w-[1500px]",
    medium: "w-[50%] max-w-[1500px]",
    large: "w-[80%] max-w-[1500px] max-h-[95%] overflow-y-scroll",
  }[size];

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className={sizeClass}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mb-4">{dialogContent}</div>
        <div className="flex justify-end gap-2">
          {/* <button onClick={onConfirm} className="btn-primary">
            Confirm
          </button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
