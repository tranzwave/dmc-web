import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface DataTableDropDownProps<T> {
  // prop: Activity;
  data: T;
  onViewPath: (data: T) => string;
  onEditPath: (data: T) => string;
  onDeletePath: (data: T) => string;

  routeBase: string;
}
const DataTableDropDwn = <T,>({
  data,
  routeBase,
  onViewPath,
  onEditPath,
  onDeletePath,
}: DataTableDropDownProps<T>) => {
  const onView = () => {
    console.log("View action triggered");
    const path = onViewPath(data);
    window.location.href = path;
  };

  const onEdit = () => {
    console.log("Edit action triggered");
    const path = onEditPath(data);
    window.location.href = path;
  };

  const onDelete = () => {
    console.log("Delete action triggered");
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>More</DropdownMenuLabel> */}
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
