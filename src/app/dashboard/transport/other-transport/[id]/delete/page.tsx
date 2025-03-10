"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { deleteOtherTransportCascade } from "~/server/db/queries/transport";

export default function DeleteTransportPage({ params }: { params: { id: string } }) {
  const [isDialogOpen, setIsDialogOpen] = useState(true); // Dialog initially open
  const [loading, setLoading] = useState(false); // Loading state for delete operation
  const router = useRouter(); // Next.js router to handle navigation
  const {toast} = useToast()

  const handleDelete = async () => {
    setLoading(true); // Start loading

    try {
      const response = await deleteOtherTransportCascade(params.id)
      if(!response){
        throw new Error("Couldn't delete vendor")
      }
      setLoading(false);
      toast({
        title: "Vendor deleted successfully",
        description:"Vendor has been deleted successfully"
      })
      router.push("/dashboard/transport?tab=other");
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("This vendor has ongoing vouchers")
      toast({
        title: "Uh oh! You can't delete this vendor",
        description:"This vendor has ongoing voucher lines"
      })
      setLoading(false);
      router.push("/dashboard/transport?tab=other");
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this vendor?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => router.push("/dashboard/transport?tab=other")}>
            No
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Deleting..." : "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
