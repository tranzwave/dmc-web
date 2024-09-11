"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { deleteHotelCascade } from "~/server/db/queries/hotel";
import { useToast } from "~/hooks/use-toast";

export default function DeleteHotelPage({ params }: { params: { id: string } }) {
  const [isDialogOpen, setIsDialogOpen] = useState(true); // Dialog initially open
  const [loading, setLoading] = useState(false); // Loading state for delete operation
  const router = useRouter(); // Next.js router to handle navigation
  const {toast} = useToast()

  const handleDelete = async () => {
    setLoading(true); // Start loading

    try {
      const response = await deleteHotelCascade(params.id)
      if(!response){
        throw new Error("Couldn't delete hotel")
      }
      alert(response)
      setLoading(false);
      router.push("/dashboard/hotels");
    } catch (error) {
      console.error("Error deleting hotel:", error);
      alert("This hotel has ongoing vouchers")
      toast({
        title: "Uh oh! You can't delete this hotel",
        description:"This hotel has ongoing voucher lines"
      })
      setLoading(false);
      router.push("/dashboard/hotels");
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this hotel?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => router.push("/dashboard/hotels")}>
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
