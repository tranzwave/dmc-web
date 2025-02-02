"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useOrganization } from '@clerk/nextjs';
import LoadingLayout from '~/components/common/dashboardLoading';
import { updateBankDetails } from '~/server/auth';
import { set } from 'date-fns';
import { toast } from '~/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import { OrganizationResource } from '@clerk/types';

interface BankDetailsFormProps {
    organization: OrganizationResource;
}

const bankDetailsSchema = z.object({
    accountName: z.string().min(1, "Account Name is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    bankName: z.string().min(1, "Bank Name is required"),
    branchName: z.string().min(1, "Branch Name is required"),
    branchAddress: z.string().min(1, "Branch Address is required"),
    SWIFTCode: z.string().min(1, "SWIFT Code is required"),
});

type BankDetails = z.infer<typeof bankDetailsSchema>;

const BankDetailsForm: React.FC<BankDetailsFormProps> = ({ organization }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<BankDetails>({
        resolver: zodResolver(bankDetailsSchema),
        defaultValues: organization.publicMetadata.bankDetails as BankDetails
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if(!organization) {
            return;
        }
        console.log('Bank Details:', organization.publicMetadata.bankDetails);
    }
    , [organization]);

    const onSubmit = async(data: BankDetails) => {
        // Handle form submission logic here
        if(!organization) {
            return;
        }
        try {
            setSaving(true);
            // Update bank details
            await updateBankDetails(organization.id, data);
            console.log('Bank Details Updated:', organization.publicMetadata);
            setSaving(false);
            toast({
                title: 'Bank Details Updated',
                description: 'Your bank details have been updated successfully',
                duration: 5000,
            })
        } catch (error) {
            console.error('Error updating bank details:', error);
            setSaving(false);
            toast({
                title: 'Error Updating Bank Details',
                description: 'An error occurred while updating your bank details. Please try again later.',
                duration: 5000,
            })
        }
    };

    return (
        <div className='w-full flex justify-center'>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4 border rounded-md text-[13px] w-[70%] max-h-[98%]">
            <div className='card-title'>Bank Details</div>
            <div>
                <Label htmlFor="accountName">Account Name:</Label>
                <Input
                    id="accountName"
                    type="text"
                    {...register("accountName")}
                    className="border border-gray-300 rounded px-2 py-1"
                />
                {errors.accountName && <p className="text-red-500">{errors.accountName.message}</p>}
            </div>
            <div>
                <Label htmlFor="accountNumber">Account Number:</Label>
                <Input
                    id="accountNumber"
                    type="text"
                    {...register("accountNumber")}
                    className="border border-gray-300 rounded px-2 py-1"
                />
                {errors.accountNumber && <p className="text-red-500">{errors.accountNumber.message}</p>}
            </div>
            <div>
                <Label htmlFor="bankName">Bank Name:</Label>
                <Input
                    id="bankName"
                    type="text"
                    {...register("bankName")}
                    className="border border-gray-300 rounded px-2 py-1"
                />
                {errors.bankName && <p className="text-red-500">{errors.bankName.message}</p>}
            </div>
            <div>
                <Label htmlFor="branchName">Branch Name:</Label>
                <Input
                    id="branchName"
                    type="text"
                    {...register("branchName")}
                    className="border border-gray-300 rounded px-2 py-1"
                />
                {errors.branchName && <p className="text-red-500">{errors.branchName.message}</p>}
            </div>
            <div>
                <Label htmlFor="branchAddress">Branch Address:</Label>
                <Input
                    id="branchAddress"
                    type="text"
                    {...register("branchAddress")}
                    className="border border-gray-300 rounded px-2 py-1"
                />
                {errors.branchAddress && <p className="text-red-500">{errors.branchAddress.message}</p>}
            </div>
            <div>
                <Label htmlFor="SWIFTCode">SWIFT Code:</Label>
                <Input
                    id="SWIFTCode"
                    type="text"
                    {...register("SWIFTCode")}
                    className="border border-gray-300 rounded px-2 py-1"
                />
                {errors.SWIFTCode && <p className="text-red-500">{errors.SWIFTCode.message}</p>}
            </div>
            <Button type="submit" variant="primaryGreen" disabled={saving}>
                {saving ? (
                    <div className="flex items-center justify-center space-x-2">
                        <LoaderCircle size={16} className='animate-spin' />
                        <span>Saving</span>
                    </div>
                ) : 'Save Bank Details'}
            </Button>
        </form>
        </div>
    );
};

export default BankDetailsForm;