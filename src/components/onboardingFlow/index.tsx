"use client";
import React, { useEffect, useState } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import {
  SignOutButton,
  useOrganization,
  useSession,
  useUser,
} from "@clerk/nextjs";
import { useToast } from "~/hooks/use-toast";
import LoadingLayout from "../common/dashboardLoading";
import { UserResource } from "@clerk/types";
import { SelectCountry } from "~/server/db/schemaTypes";
import { db } from "@vercel/postgres";
import { getAllCountries } from "~/server/db/queries/countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useRouter } from "next/navigation";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PaymentForm from "../payment/PaymentForm";
import { updateUserPublicMetadata } from "~/server/auth";
import { Permissions } from "~/lib/types/global";
import { set } from "date-fns";

interface OnboardingFlowProps {
  isNewlyInvitedMember: boolean
}

// Zod schemas for validation
const personalDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  contactNumber: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid() ?? false;
    },
    { message: "Invalid phone number" },
  ),
  address: z.string().min(1, "Address is required"),
});

const organizationDetailsSchema = z.object({
  orgName: z.string().min(1, "Organization name is required"),
  domainName: z.string().min(1, "Domain name is required"),
  website: z.string().min(1, "Website is required"),
  country: z.string().min(1, "Country is required"),
  contactNumber: z.string().refine(
    (value) => {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber?.isValid() ?? false;
    },
    { message: "Invalid phone number" },
  ),
  address: z.string().min(1, "Address is required"),
});

// Types for form values
export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;
export type OrganizationDetailsFormValues = z.infer<
  typeof organizationDetailsSchema
>;

const OnboardingFlow = ({isNewlyInvitedMember} : OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [countries, setCountries] = useState<SelectCountry[]>([]);
  const router = useRouter()
  const [isPersonalDetailsSaving, setIsPersonalDetailsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const countriesResponse = await getAllCountries();
        if (!countriesResponse) {
          throw new Error("Couldn't get countries");
        }
        console.log(countriesResponse)
        setCountries(countriesResponse);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Separate forms for each step
  const personalFormMethods = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: { name: "", email: "", contactNumber: "", address: "" },
  });

  const organizationFormMethods = useForm<OrganizationDetailsFormValues>({
    resolver: zodResolver(organizationDetailsSchema),
    defaultValues: { orgName: "", domainName: "", country: "" },
  });

  const handlePersonalSubmit: SubmitHandler<PersonalDetailsFormValues> = async (
    data,
  ) => {
    if(!user){
      return;
    
    }
    console.log("Personal details submitted:", data);
    if(!isNewlyInvitedMember){
      setStep(2);
    } else {
      try {
        setIsPersonalDetailsSaving(true);
        const memberships = await organization?.getMemberships()
        console.log(memberships);
        const usersRole = memberships?.data.find((member) => member.publicUserData.userId === user.id)?.role;

        if(!usersRole){
          throw new Error("User role not found")
        }

        const response = await updateUserPublicMetadata(user.id, {
          role: usersRole === "org:admin" ? "admin" : "member",
          permissions: [
            "sys_domains:manage",
            "sys_domains:read",
            "sys_memberships:manage",
            "sys_memberships:read",
            "sys_profile:delete",
            "sys_profile:manage",
          ],
          info: {
            contact: data.contactNumber,
            address: data.address,
          },
          teams: []
        });

        if (!response) {
          throw new Error("Error updating user metadata");
        }

        console.log("User metadata updated successfully:", response);
        setIsPersonalDetailsSaving(false);
        router.push("/dashboard/overview");
      } catch (error) {
        console.error("Error updating user metadata:", error);
        toast({
          title: "Uh oh!",
          description: "Couldn't update user metadata",
        });
        setIsPersonalDetailsSaving(false);
      }
    }
  };

  const handleOrganizationSubmit: SubmitHandler<OrganizationDetailsFormValues> = async (data) => {
    console.log("Organization details submitted:", data);
    console.log(personalFormMethods.getValues());
    console.log(user);
    console.log(session);
    const token = await session?.getToken();
    console.log(organization);
  
    try {
      setIsLoading(true);
      const response = await fetch("/api/tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id ?? "",
          name: data.orgName,
          createdBy: user?.id ?? "",
          publicMetadata: {
            country: data.country,
            domainName: data.domainName,
            website: data.website,
            contactNumber: data.contactNumber,
            address: data.address,
          },
          userData: {
            contact: personalFormMethods.getValues("contactNumber"),
            address: personalFormMethods.getValues("address"),
          },
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        console.error("Error creating organization:", responseData);
        throw new Error(responseData.message || "Unknown error occurred");
      }
  
      console.log(responseData?.clerkResponse);
      toast({
        title: "Success!",
        description: "Your organization has been created successfully",
      });
      
      router.push(`/org-selection?orgId=${responseData.clerkResponse}`);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Organization creation failed:", error);
      setIsLoading(false);
      toast({
        title: "Uh oh!",
        description: error.message || "Couldn't create the organization",
      });
    }
  };
  

  if (!isLoaded) {
    return <LoadingLayout />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-5 text-[#111729] shadow-2xl">
      <div className="w-full max-w-[520px] rounded-lg bg-white p-6 shadow-md">
        {step === 1 ? (
          <Form {...personalFormMethods}>
            <form
              onSubmit={personalFormMethods.handleSubmit(handlePersonalSubmit)}
              className="space-y-6"
            >
              <h2 className="mb-4 text-center text-2xl font-bold text-[#287F71]">
                Personal Details
              </h2>
              <PersonalDetailsForm
                form={personalFormMethods}
                user={user as UserResource}
              />
              <Button
                type="submit"
                className="mt-4 w-full rounded bg-[#287F71] py-2 text-white transition duration-300 hover:bg-[#206757]"
                disabled={isPersonalDetailsSaving}
              >
                <div className="flex flex-row">
                  {isPersonalDetailsSaving ? (
                    <div className="flex flex-row">
                      <LoaderCircle size={16} className="animate-spin" />
                      <div>Please Wait</div>
                    </div>
                  ) : (
                    <div>Continue</div>
                  )}
                </div>
              </Button>
            </form>
          </Form>
        ) : step === 2 ? (
          <div>
            <div className="my-2 cursor-pointer">
              <ArrowLeft
                color="#287f71"
                size={20}
                onClick={() => {
                  isLoading ? "" : setStep(1);
                }}
              />
            </div>
            <Form {...organizationFormMethods}>
              <form
                onSubmit={organizationFormMethods.handleSubmit(
                  handleOrganizationSubmit,
                )}
                className="space-y-6"
              >
                <h2 className="mb-4 text-center text-2xl font-bold text-primary-green">
                  Organization Details
                </h2>

                <OrganizationDetailsForm
                  form={organizationFormMethods}
                  countries={countries}
                />
                <Button
                  type="submit"
                  className="mt-4 w-full rounded bg-primary-green py-2 text-white transition duration-300 hover:bg-[#b96a1f]"
                  disabled={isLoading}
                >
                  <div className="flex flex-row">
                    {isLoading ? (
                      <div className="flex flex-row">
                        <LoaderCircle size={16} className="animate-spin" />
                        <div>Creating</div>
                      </div>
                    ) : (
                      <div>Create Organization</div>
                    )}
                  </div>
                </Button>
              </form>
            </Form>
          </div>
        ) : step === 3 ? (
          <div>
            <h2 className="mb-4 text-center text-2xl font-bold text-[#287F71]">
              Choose Your Perfect Plan
            </h2>
            <div>
              {/* <PaymentForm onCloseDialog={()=>{console.log("Close dialog")}}/> */}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="text-[13px]">Sign in with a different account</div>
      <Button variant={"primaryGreen"} className="h-8 text-[13px]">
        <SignOutButton />
      </Button>
    </div>
  );
};

// Component for Personal Details Form
const PersonalDetailsForm = ({
  form,
  user,
}: {
  form: UseFormReturn<PersonalDetailsFormValues>;
  user: UserResource | null;
}) => {
  form.setValue("name", user?.fullName ?? "");
  form.setValue("email", user?.primaryEmailAddress?.emailAddress ?? "");
  return (
    <>
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Name"
                {...field}
                value={field.value ?? user?.fullName ?? ""}
                disabled={!!user?.fullName}
              />
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
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="Email"
                {...field}
                value={
                  field.value ?? user?.primaryEmailAddress?.emailAddress ?? ""
                }
                disabled={!!user?.primaryEmailAddress?.emailAddress}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="contactNumber"
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
      <FormField
        name="address"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="Address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

// Component for Organization Details Form
const OrganizationDetailsForm = ({
  form,
  countries,
}: {
  form: UseFormReturn<OrganizationDetailsFormValues>;
  countries: SelectCountry[];
}) => {
  return (
    <>
      <FormField
        name="orgName"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Name</FormLabel>
            <FormControl>
              <Input placeholder="Organization Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="domainName"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Domain Name</FormLabel>
            <FormControl>
              <Input placeholder="Domain Name (e.g., orgname)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="website"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input
                placeholder="Landing Page URL"
                {...field}
              />
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
              <Select
                onValueChange={(valueFromSelection) => {
                  field.onChange(valueFromSelection);
                }}
                value={field.value}
                defaultValue={field.value}
              >
                <SelectTrigger className="bg-slate-100 shadow-md">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country, index) => (
                    <SelectItem key={index} value={country.code}>
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
        name="contactNumber"
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
      <FormField
        name="address"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="Address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default OnboardingFlow;
