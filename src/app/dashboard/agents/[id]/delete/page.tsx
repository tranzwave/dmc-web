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
import { deleteAgentCascade } from "~/server/db/queries/agents";

export default function DeleteHotelPage({ params }: { params: { id: string } }) {
  const [isDialogOpen, setIsDialogOpen] = useState(true); // Dialog initially open
  const [loading, setLoading] = useState(false); // Loading state for delete operation
  const router = useRouter(); // Next.js router to handle navigation
  const {toast} = useToast()

  const handleDelete = async () => {
    setLoading(true); // Start loading

    try {
      const response = await deleteAgentCascade(params.id)
      if(!response){
        throw new Error("Couldn't delete agent")
      }
      setLoading(false);
      router.push("/dashboard/agents");
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("This agent has ongoing vouchers")
      toast({
        title: "Uh oh! You can't delete this agent",
        description:"This agent has ongoing voucher lines"
      })
      setLoading(false);
      router.push("/dashboard/agents");
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this agent?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => router.push("/dashboard/agents")}>
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
