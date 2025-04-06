"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberFromString } from "libphonenumber-js"; // Correct import for parsing
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { z } from "zod";
import { useAddAgent } from "~/app/dashboard/agents/add/context";
import LoadingLayout from "~/components/common/dashboardLoading";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/hooks/use-toast";
import { ClerkUserPublicMetadata } from "~/lib/types/payment";
import { getAllCountries } from "~/server/db/queries/agents";
import { getAllMarketingTeams } from "~/server/db/queries/marketingTeams";
import { SelectCountry, SelectMarketingTeam } from "~/server/db/schemaTypes";

export const generalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  countryCode: z.string().min(1, "Country is required"),
  email: z.string().email("Invalid email address"),
  primaryContactNumber: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid() ?? false;
    },
    { message: "Invalid phone number" },
  ),
  agency: z.string().min(1, "Agency is required"),
  address: z.string().min(1, "Address is required"),
  marketingTeamId: z.string().min(1, "Marketing team is required"),
});

type GeneralFormValues = z.infer<typeof generalSchema>;

const GeneralForm = () => {
  const [countries, setCountries] = useState<SelectCountry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setGeneralDetails, agentDetails, setActiveTab } = useAddAgent();
  const [marketingTeams, setMarketingTeams] = useState<SelectMarketingTeam[]>([]); // Assuming you have a way to fetch marketing teams
  const { user, isLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: agentDetails.general,
  });

  const fetchData = async () => {
    try {
      if (!organization || !user) {
        return;
      }
      setLoading(true);
      const result = await getAllCountries();
      const allTeams = await getAllMarketingTeams(organization.id);
      const usersTeams = (user.publicMetadata as ClerkUserPublicMetadata).teams
      const marketingTeamsOfUser = usersTeams.filter((team) => {
        return team.orgId === organization.id;
      }
      ).map((team) => team.teamId);

      const filteredTeams = allTeams.filter((team) => {
        return marketingTeamsOfUser.includes(team.id);
      }
      );

      setMarketingTeams(filteredTeams);
      setCountries(result);
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch country data:", error);
      setError("Failed to load data.");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<GeneralFormValues> = (data) => {
    console.log(data);
    setGeneralDetails(data);
    setActiveTab("submit");
  };

  if (!isLoaded || !orgLoaded) {
    return <LoadingLayout />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="countryCode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : (
                        countries.map((countryCode) => (
                          <SelectItem
                            key={countryCode.id}
                            value={String(countryCode.code)}
                          >
                            {countryCode.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
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
                <FormLabel>Contact Number</FormLabel>
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

        {/* // Address and Marketing Team */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="marketingTeamId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketing Team</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-slate-100 shadow-md">
                      <SelectValue placeholder="Select Marketing Team" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : (
                        marketingTeams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <FormField
              name="agency"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Agency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex w-full flex-row justify-end">
          <Button type="submit" variant={"primaryGreen"}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneralForm;
