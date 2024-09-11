// import { MoreHorizontal, MoreVertical } from "lucide-react";
// import { Button } from "~/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "~/components/ui/dropdown-menu";

// interface DataTableDropDownProps<T> {
//   // prop: Activity;
//   data: T;
//   onViewPath: (data: T) => string;
//   onEditPath: (data: T) => string;
//   onDeletePath: (data: T) => string;

//   routeBase: string;
// }
// const DataTableDropDwn = <T,>({
//   data,
//   routeBase,
//   onViewPath,
//   onEditPath,
//   onDeletePath,
// }: DataTableDropDownProps<T>) => {
//   const onView = () => {
//     console.log("View action triggered");
//     const path = onViewPath(data);
//     window.location.href = path;
//   };

//   const onEdit = () => {
//     console.log("Edit action triggered");
//     const path = onEditPath(data);
//     window.location.href = path;
//   };

//   const onDelete = () => {
//     console.log("Delete action triggered");
//   };

//   return (
//     <div>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Open menu</span>
//             <MoreVertical className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           {/* <DropdownMenuLabel>More</DropdownMenuLabel> */}
//           <DropdownMenuItem onSelect={onView}>View</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onSelect={onEdit}>Edit</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

// export default DataTableDropDwn;



import { MoreVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface DataTableDropDownProps<T> {
  data: T;
  onViewPath: (data: T) => string;
  onEditPath: (data: T) => string;
  onDeletePath: (data: T) => string;
  routeBase: string;
  // Optionally, you can add a callback for after deletion
  onDeleted?: () => void;
}

const DataTableDropDwn = <T,>({
  data,
  routeBase,
  onViewPath,
  onEditPath,
  onDeletePath,
  onDeleted,  // callback for after successful deletion
}: DataTableDropDownProps<T>) => {

  // View action
  const onView = () => {
    console.log("View action triggered");
    const path = onViewPath(data);
    window.location.href = path;
  };

  // Edit action
  const onEdit = () => {
    console.log("Edit action triggered");
    const path = onEditPath(data);
    window.location.href = path;
  };

  // Delete action
  const onDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(onDeletePath(data), {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Item deleted successfully!");
            if (onDeleted) onDeleted();  // Call the optional callback if provided
        } else {
            alert("Failed to delete item.");
            console.log(await response.text()); // Log response body for debugging
        }
    } catch (error) {
        console.error("Error during deletion:", error);
        alert("An error occurred during deletion.");
    }
};



  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onView}>View</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DataTableDropDwn;
