import * as React from "react";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";

interface SingleSelectProps {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string | null) => void;
  defaultValue?: string | null;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const SingleSelect = React.forwardRef<HTMLButtonElement, SingleSelectProps>(
  ({ options, onValueChange, defaultValue = null, placeholder = "Select an option", disabled, className, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<string | null>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleSelect = (value: string) => {
      setSelectedValue(value);
      onValueChange(value);
      setIsPopoverOpen(false);
    };

    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedValue(null);
      onValueChange(null);
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className={cn("flex w-full p-2 rounded-md border min-h-10 items-center justify-between bg-inherit hover:bg-inherit", className)}
          >
            <span className={`text-sm mx-3 ${selectedValue ? ' text-zinc-800' : 'text-muted-foreground'}`}>
              {selectedValue ? options.find((o) => o.value === selectedValue)?.label : placeholder}
            </span>
            <div className="flex items-center">
              {selectedValue && <XIcon className="h-4 w-4 mx-2 cursor-pointer text-muted-foreground" onClick={handleClear} />}
              <ChevronDown className="h-4 w-4 cursor-pointer text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer w-full max-w-full"
                    disabled={disabled}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValue === option.value ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

SingleSelect.displayName = "SingleSelect";
