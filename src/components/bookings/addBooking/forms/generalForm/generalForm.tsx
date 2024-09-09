"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { StatusKey, StatusLabels, useAddBooking } from "~/app/dashboard/bookings/add/context";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
import {
  SelectAgent,
  SelectCountry,
  SelectUser,
} from "~/server/db/schemaTypes";
import { getAllAgents } from "~/server/db/queries/agents";
import { getAllUsers } from "~/server/db/queries/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getAllCountries } from "~/server/db/queries/countries";

// Define the schema for form validation
export const generalSchema = z
  .object({
    clientName: z.string().min(1, "Client name is required"),
    country: z.string().min(1, "Country is required"),
    primaryEmail: z.string().email("Invalid email address"),
    adultsCount: z.number().min(0, "Add adult count"),
    kidsCount: z.number().min(0, "Add kids count"),
    startDate: z.string().min(1, "Start date is required"),
    numberOfDays: z.number().min(1, "Number of days must be at least 1"),
    endDate: z.string().min(1, "End date is required"),
    marketingManager: z.string().min(1, "Marketing manager is required"),
    agent: z.string().min(1, "Agent is required"),
    tourType: z.string().min(1, "Tour type is required"),
    includes: z.object({
      hotels: z.boolean(),
      transport: z.boolean(),
      activities: z.boolean(),
    }),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be earlier than start date",
    path: ["endDate"],
  });

// Define the type of the form values
type GeneralFormValues = z.infer<typeof generalSchema>;

// Define checkbox options
const includesOptions = [
  { id: "hotels", label: "Hotels" },
  { id: "restaurants", label: "Restaurants" },
  { id: "transport", label: "Transport" },
  { id: "activities", label: "Activities" },
  { id: "shops", label: "Shops" },

];

const GeneralForm = () => {
  const { setGeneralDetails, bookingDetails, setActiveTab, setStatusLabels } =
    useAddBooking();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<SelectAgent[]>([]);
  const [users, setUsers] = useState<SelectUser[]>([]);
  const [countries, setCountries] = useState<SelectCountry[]>([]);
  const [error, setError] = useState<string>();
  const [selectedAgent, setSelectedAgent] = useState<SelectAgent | null>();
  const [selectedManager, setSelectedManager] = useState<SelectUser | null>();

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: bookingDetails.general,
  });

  const startDate = form.watch("startDate");
  const numberOfDays = form.watch("numberOfDays");

  // const getAgents = async () => {
  //   try {
  //     const response = await getAllAgents();

  //     if (!response) {
  //       throw new Error(`Error: ${response}`);
  //     }
  //     console.log("Fetched Agents:", response);

  //     setAgents(response);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       setError(error.message);
  //     } else {
  //       setError("An unknown error occurred");
  //     }
  //     console.error("Error:", error);
  //   }
  // };

  // const getUsers = async () => {
  //   try {
  //     const response = await getAllUsers();

  //     if (!response) {
  //       throw new Error(`Error: ${response}`);
  //     }
  //     console.log("Fetched Agents:", response);

  //     setUsers(response);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       setError(error.message);
  //     } else {
  //       setError("An unknown error occurred");
  //     }
  //     console.error("Error:", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      // Run both requests in parallel
      setLoading(true);
      const [agentsResponse, usersResponse, countriesResponse] =
        await Promise.all([getAllAgents(), getAllUsers(), getAllCountries()]);

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
  }, []);

  useEffect(() => {
    // if (startDate && numberOfDays) {
    //   const endDate = new Date(startDate);
    //   endDate.setDate(endDate.getDate());
    //   form.setValue("endDate", endDate.toISOString().split("T")[0] ?? "");
    // }
  }, [startDate, numberOfDays, form]);

  const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
    const sd = new Date(data.startDate);
    const ed = new Date(data.endDate);
    
    const diffInMilliseconds = ed.getTime() - sd.getTime();
    
    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    
    alert(`Number of days between the dates: ${diffInDays}`);
    data.numberOfDays = diffInDays
    console.log(data);
    setGeneralDetails(data);
    setActiveTab("hotels");
  };

  function getAgentId(agentName: string) {
    const agent = agents.find((agent) => agent.name === agentName);
    const id = agent?.id;
    alert(id);
    setSelectedAgent(agent);
  }

  function getManagerId(managerName: string) {
    const manager = users.find((manager) => manager.name === managerName);
    const id = manager?.id;
    alert(id);
    setSelectedManager(manager);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            name="clientName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
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
                      alert(value);
                    }}
                    value={field.value}
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
                  <Input type="date" {...field} />
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
                  <Input
                    type="date"
                    {...field}
                    min={form.watch("startDate") ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="marketingManager"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketing Manager</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter marketing manager's name" {...field} /> */}
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      alert(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) =>
                        user.role === "manager" ? (
                          <SelectItem key={user.id} value={user?.id ?? ""}>
                            {user.name}
                          </SelectItem>
                        ) : null,
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agent"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter agent's name" {...field} /> */}
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      alert(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent?.id ?? ""}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="tourType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tour Type</FormLabel>
              <FormControl>
                <Input placeholder="Enter tour type" {...field} />
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
                          const labelKey = option.id as keyof StatusLabels
                          setStatusLabels((prev) => ({
                            ...prev,
                            [labelKey]: checked ? "Mandatory" : "Locked",
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

        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"}>
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;
