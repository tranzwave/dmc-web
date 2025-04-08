"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { format, parse } from "date-fns";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  StatusLabels,
  useEditBooking
} from "~/app/dashboard/bookings/[id]/edit/context";
import { addBookingGeneralSchema } from "~/components/bookings/addBooking/forms/generalForm/generalForm";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { tourTypes } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { getAllAgents, getAllAgentsForMarketingTeams } from "~/server/db/queries/agents";
import { updateBookingLine } from "~/server/db/queries/booking";
import { getAllCountries } from "~/server/db/queries/countries";
import { getAllUsers } from "~/server/db/queries/users";
import {
  SelectAgent,
  SelectCountry,
  SelectMarketingTeam,
  SelectUser,
} from "~/server/db/schemaTypes";
import { useOrganization, useUser } from "@clerk/nextjs";
import { OrganizationMembershipResource } from "@clerk/types";
import { toast } from "~/hooks/use-toast";
import { marketingTeam } from "~/server/db/schema";
import { PartialClerkUser } from "~/lib/types/marketingTeam";
import { ClerkUserPublicMetadata } from "~/lib/types/payment";

// Define the schema for form validation
export const generalSchema = z
  .object({
    clientName: z.string().min(1, "Client name is required"),
    country: z.string().min(1, "Country is required"),
    primaryEmail: z.string().email("Invalid email address"),
    primaryContactNumber: z.string().refine(
      (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() ?? false;
      },
      { message: "Invalid phone number" },
    ),
    adultsCount: z.number().min(0, "Add adult count"),
    kidsCount: z.number().min(0, "Add kids count"),
    startDate: z.string().min(1, "Start date is required"),
    numberOfDays: z.number().min(1, "Number of days must be at least 1"),
    endDate: z.string().min(1, "End date is required"),
    // marketingManager: z.string().min(1, "Marketing manager is required"),
    // marketingTeam: z.string().min(1, "Marketing team is required"),
    agent: z.string().min(1, "Agent is required"),
    tourType: z.string().min(1, "Tour type is required"),
    includes: z.object({
      hotels: z.boolean(),
      restaurants: z.boolean(),
      transport: z.boolean(),
      activities: z.boolean(),
      shops: z.boolean(),
    }),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be earlier than start date",
    path: ["endDate"],
  });

// Define the type of the form values
type GeneralFormValues = z.infer<typeof addBookingGeneralSchema>;

// Define checkbox options
const includesOptions = [
  { id: "hotels", label: "Hotels" },
  { id: "restaurants", label: "Restaurants" },
  { id: "transport", label: "Transport" },
  { id: "activities", label: "Activities" },
  { id: "shops", label: "Shops" },
];

interface GeneralFormProps {
  allUsers: PartialClerkUser[];
  marketingTeams: SelectMarketingTeam[];
}

const GeneralForm = ({ allUsers, marketingTeams }:GeneralFormProps) => {
  const { setGeneralDetails, bookingDetails, setActiveTab, setStatusLabels } =
    useEditBooking();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [agents, setAgents] = useState<SelectAgent[]>([]);
  const [users, setUsers] = useState<SelectUser[]>([]);
  const [countries, setCountries] = useState<SelectCountry[]>([]);
  const [error, setError] = useState<string>();
  const [selectedAgent, setSelectedAgent] = useState<SelectAgent | null>();
  const [selectedManager, setSelectedManager] = useState<SelectUser | null>();
  // const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState("0");
  const pathname = usePathname();
  const router = useRouter();
  const { organization, isLoaded } = useOrganization();
  const [members, setMembers] = useState<OrganizationMembershipResource[]>([]); // Correct type for members
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMarketingTeam, setSelectedMarketingTeam] = useState<string | null>();
  const [selectedMarketingTeamManagers, setSelectedMarketingTeamManagers] = useState<PartialClerkUser[]>([]);
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);


 

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(addBookingGeneralSchema),
    defaultValues: {...bookingDetails.general, directCustomer : bookingDetails.general.primaryEmail ? true : false},
  });

  const startDate = form.watch("startDate");
  const numberOfDays = form.watch("numberOfDays");

  const fetchData = async () => {
    if(!isLoaded || !organization || !user){
      return
    }
    try {
      // Run both requests in parallel
      setLoading(true);
      const usersTeams = (user.publicMetadata as ClerkUserPublicMetadata).teams.filter((team) => {
        return team.orgId === organization.id;
      }
      ).map((team) => team.teamId);
      const [agentsResponse, usersResponse, countriesResponse] =
        await Promise.all([getAllAgentsForMarketingTeams(organization.id, usersTeams), getAllUsers(), getAllCountries()]);

      // Check for errors in the responses
      if (!agentsResponse) {
        throw new Error("Error fetching agents");
      }

      if (!usersResponse) {
        throw new Error("Error fetching users");
      }

      if (!countriesResponse) {
        throw new Error("Error fetching countries");
      }

      console.log("Fetched Agents:", agentsResponse);
      console.log("Fetched Users:", usersResponse);
      console.log("Fetched Users:", countriesResponse);

      // Set states after successful fetch
      setAgents(agentsResponse);
      setUsers(usersResponse);
      setCountries(countriesResponse);

      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const fetchMembers = async () => {
      if (organization) {
        try {
          setIsLoading(true);
          const memberships = await organization.getMemberships();
          setMembers(memberships.data); // Set the 'items' array containing memberships
          console.log(memberships);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching members:", error);
          setIsLoading(false);
        }
      }
    };

    fetchMembers();
    setSelectedMarketingTeam(bookingDetails.general.marketingTeam);
    setSelectedMarketingTeamManagers(allUsers.filter((user) => (user.publicMetadata as ClerkUserPublicMetadata)?.teams?.some(t => t.teamId === bookingDetails.general.marketingTeam && t.role === "manager")));
  }, [organization]);

  const onSubmit: SubmitHandler<GeneralFormValues> = async (data) => {
    setSaving(true);
    const sd = new Date(data.startDate);
    const ed = new Date(data.endDate);

    const diffInMilliseconds = ed.getTime() - sd.getTime();

    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));

    data.numberOfDays = diffInDays;
    console.log(data);
    setGeneralDetails(data);
    try {


      const updatedBooking = await updateBookingLine(
        pathname.split("/")[3] ?? "",
        {
          ...data
        }
      )

      if (updatedBooking) {
        // If createNewBooking succeeds, set the success message and show modal
        setMessage(
          "Booking Updated! Do you want to continue finalizing the tasks for this booking?",
        );
        setId(updatedBooking);
        toast({
          title: "Success!",
          description: "Booking Updated Successfully",
          duration: 5000,
        });
      }
    } catch (error) {
      setMessage("An error occurred while updating the booking.");
      toast({
        title: "Uh Oh!",
        description: "An error occurred while updating the booking.",
        duration: 5000,
      });
      console.error("Error in handleSubmit:", error);
    } finally {
      setSaving(false);
    }
  };

  function getAgentId(agentName: string) {
    const agent = agents.find((agent) => agent.name === agentName);
    const id = agent?.id;
    setSelectedAgent(agent);
  }

  function getManagerId(managerName: string) {
    const manager = users.find((manager) => manager.name === managerName);
    const id = manager?.id;
    setSelectedManager(manager);
  }

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              name="clientName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="country"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Select Country" {...field} /> */}
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                      disabled = {true}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem
                            key={country.id}
                            value={country?.code ?? ""}
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="directCustomer"
              control={form.control}
              
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direct Customer</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Select Country" {...field} /> */}
                    <Select
                      onValueChange={(value) => field.onChange(value === "Yes")}
                      value={field.value ? "Yes" : "No"}
                      disabled = {true}
                    >
                      <SelectTrigger className="bg-slate-100 shadow-md">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"Yes"}>Yes</SelectItem>
                        <SelectItem value={"No"}>No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("directCustomer") == true ? (
              <div>
                <FormField
                  name="primaryEmail"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter primary email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="primaryContactNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Contact Number</FormLabel>
                      <FormControl>
                      <PhoneInput
                    country={"us"}
                    value={field.value}
                    onChange={(phone) => field.onChange(`+${phone}`)}
                    inputClass="w-full shadow-md"
                    inputStyle={{ width: "inherit" }}
                  />
                        
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-row gap-1">
              <FormField
                name="adultsCount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adults</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="kidsCount"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kids</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        min={0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                  <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "LLL dd, y")
                          ) : (
                            <span>Pick the arrival date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          selected={
                            field.value
                              ? parse(field.value, "MM/dd/yyyy", new Date())
                              : new Date()
                          }
                          onSelect={(date: Date | undefined) => {
                            const dateString = format(
                              date ?? new Date(),
                              "MM/dd/yyyy",
                            );
                            field.onChange(dateString);
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
            name="numberOfDays"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
            <FormField
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                  <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "LLL dd, y")
                          ) : (
                            <span>Pick the departure date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          initialFocus
                          selected={
                            field.value
                              ? parse(field.value, "MM/dd/yyyy", new Date())
                              : new Date()
                          }
                          onSelect={(date: Date | undefined) => {
                            const dateString = format(
                              date ?? new Date(),
                              "MM/dd/yyyy",
                            );
                            field.onChange(dateString);
                          }}
                          numberOfMonths={1}
                          disabled={(date) => {
                            const startDate = form.watch("startDate");
                            const startParsed = startDate
                              ? parse(startDate, "MM/dd/yyyy", new Date())
                              : null;
                            return startParsed ? date < startParsed : false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
          {form.watch("directCustomer") == true ? (
              <div></div>
            ) : (
              <FormField
                name="agent"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Agent</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter agent's name" {...field} /> */}
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        disabled = {true}
                      >
                        <SelectTrigger className="bg-slate-100 shadow-md">
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent?.id ?? ""}>
                              {agent.name} - {agent.agency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            name="tourType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tour Type</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter tour type" {...field} /> */}
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select Tour Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {tourTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="includes"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Select Tour Includes
                  </FormLabel>
                  <FormDescription>
                    Choose the options you want to include in this tour.
                  </FormDescription>
                </div>
                <div className="grid w-full grid-cols-5 items-center gap-3">
                  {includesOptions.map((option) => (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-end space-x-3 rounded-lg p-2"
                    >
                      <FormControl>
                        <Checkbox
                          checked={
                            field.value[option.id as keyof typeof field.value]
                          }
                          onCheckedChange={(checked) => {
                            const labelKey = option.id as keyof StatusLabels;
                            setStatusLabels((prev) => ({
                              ...prev,
                              [labelKey]: checked ? "Included" : "Not Included",
                            }));
                            field.onChange({
                              ...field.value,
                              [option.id]: checked,
                            });
                          }}
                          name={option.id}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-row justify-end gap-2">
            <Button type="submit" variant="primaryGreen" disabled={saving}>
              {saving ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                "Save Booking"
              )}
            </Button>
          </div>
        </form>
      </Form>
      {/* <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Saved!</DialogTitle>
            <DialogDescription>
              Do you want to continue adding the required vouchers for this
              booking?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="primaryGreen" onClick={handleYes}>
              Yes
            </Button>
            <Button variant="secondary" onClick={handleNo}>
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default GeneralForm;
