"use client"
import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler, useFormContext, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { useOrganization, useSession, useUser } from '@clerk/nextjs';

// Zod schemas for validation
const personalDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  address: z.string().min(1, 'Address is required'),
});

const organizationDetailsSchema = z.object({
  orgName: z.string().min(1, 'Organization name is required'),
  domainName: z.string().min(1, 'Domain name is required'),
  country: z.string().min(1, 'Country is required'),
});

// Types for form values
export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;
export type OrganizationDetailsFormValues = z.infer<typeof organizationDetailsSchema>;

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const {user} = useUser()
  const {session} = useSession()
  const {organization} = useOrganization();

  // Separate forms for each step
  const personalFormMethods = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: { name: '', email: '', contactNumber: '', address: '' },
  });

  const organizationFormMethods = useForm<OrganizationDetailsFormValues>({
    resolver: zodResolver(organizationDetailsSchema),
    defaultValues: { orgName: '', domainName: '', country: '' },
  });

  const handlePersonalSubmit: SubmitHandler<PersonalDetailsFormValues> = (data) => {
    console.log('Personal details submitted:', data);
    setStep(2); // Move to the next step
  };

  const handleOrganizationSubmit: SubmitHandler<OrganizationDetailsFormValues> = async(data) => {
    console.log('Organization details submitted:', data);
    console.log(personalFormMethods.getValues())
    console.log(user)
    console.log(session)
    const token = await session?.getToken()
    console.log(organization)

    try {
        const response = await fetch('/api/tenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.orgName,
            createdBy: user?.id ?? "",
            publicMetadata: {
              country: data.country,
              domainName: data.domainName,
            },
          }),
        });
    
        if (!response.ok) {
          throw new Error('Error creating organization');
        }
    
        const createdOrg = await response.json();
        console.log(createdOrg);
      } catch (error) {
        console.log(error);
      }
    // Call Clerk API or handle final submission here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-onboarding-bg text-[#111729] p-5 shadow-2xl">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        {step === 1 ? (
          <Form {...personalFormMethods}>
            <form onSubmit={personalFormMethods.handleSubmit(handlePersonalSubmit)} className='space-y-6'>
              <h2 className="text-2xl font-bold mb-4 text-[#287F71] text-center">Personal Details</h2>
              <PersonalDetailsForm form={personalFormMethods}/>
              <Button type="submit" className="w-full bg-[#287F71] text-white py-2 rounded hover:bg-[#206757] transition duration-300 mt-4">
                Next
              </Button>
            </form>
          </Form>
        ) : (
            <div>
                <div className='my-2 cursor-pointer'>
                    <ArrowLeft color='#287f71' size={20} onClick={()=>setStep(1)}/>
                </div>
                <Form {...organizationFormMethods}>
                    <form onSubmit={organizationFormMethods.handleSubmit(handleOrganizationSubmit)} className='space-y-6'>
                        <h2 className="text-2xl font-bold mb-4 text-primary-green text-center">Organization Details</h2>

                        <OrganizationDetailsForm form={organizationFormMethods}/>
                        <Button type="submit" className="w-full bg-primary-green text-white py-2 rounded hover:bg-[#b96a1f] transition duration-300 mt-4">
                            Create Organization
                        </Button>
                    </form>
                </Form>

            </div>

        )}
      </div>
    </div>
  );
};

// Component for Personal Details Form
const PersonalDetailsForm = ({form}:{form: UseFormReturn<PersonalDetailsFormValues>}) => {
    return (
      <>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
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
                <Input placeholder="Email" {...field} />
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
                <Input placeholder="Contact Number" {...field} />
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
const OrganizationDetailsForm = ({form}:{form: UseFormReturn<OrganizationDetailsFormValues>}) => {
  
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
          name="country"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  };

export default OnboardingFlow;
