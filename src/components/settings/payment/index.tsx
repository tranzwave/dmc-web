"use client"
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useOrganization } from '@clerk/nextjs';
import LoadingLayout from '~/components/common/dashboardLoading';
import { updateBankDetails } from '~/server/auth';
import { toast } from '~/hooks/use-toast';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { OrganizationResource } from '@clerk/types';
import { BankDetails } from '~/lib/types/payment';

interface BankDetailsFormProps {
    organization: OrganizationResource;
}

const bankAccountSchema = z.object({
    accountName: z.string().min(1, "Account Name is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    bankName: z.string().min(1, "Bank Name is required"),
    branchName: z.string().min(1, "Branch Name is required"),
    branchAddress: z.string().min(1, "Branch Address is required"),
    SWIFTCode: z.string().min(1, "SWIFT Code is required"),
});

const bankDetailsSchema = z.object({
    bankAccounts: z.array(bankAccountSchema).min(1, "At least one bank account is required")
});

type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;

const BankDetailsForm: React.FC<BankDetailsFormProps> = ({ organization }) => {
    const [saving, setSaving] = useState(false);
    
    // Get existing bank details or default to empty array
    const existingBankDetails = (organization.publicMetadata.bankDetails as BankDetails[]) || [];
    
    const { control, handleSubmit, formState: { errors } } = useForm<BankDetailsFormData>({
        resolver: zodResolver(bankDetailsSchema),
        defaultValues: {
            bankAccounts: existingBankDetails.length > 0 ? existingBankDetails : [{
                accountName: '',
                accountNumber: '',
                bankName: '',
                branchName: '',
                branchAddress: '',
                SWIFTCode: ''
            }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "bankAccounts"
    });

    useEffect(() => {
        if(!organization) {
            return;
        }
        console.log('Bank Details:', organization.publicMetadata.bankDetails);
    }, [organization]);

    const onSubmit = async(data: BankDetailsFormData) => {
        if(!organization) {
            return;
        }
        try {
            setSaving(true);
            // Update bank details with array
            await updateBankDetails(organization.id, data.bankAccounts);
            console.log('Bank Details Updated:', data.bankAccounts);
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

    const addBankAccount = () => {
        append({
            accountName: '',
            accountNumber: '',
            bankName: '',
            branchName: '',
            branchAddress: '',
            SWIFTCode: ''
        });
    };

    const removeBankAccount = (index: number) => {
        if (fields.length > 1) {
            remove(index);
        }
    };

    return (
        <div className='w-full flex justify-center'>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-md text-[13px] w-[80%] max-h-[98%] overflow-y-auto">
                <div className='card-title flex justify-between items-center'>
                    <span>Bank Details</span>
                    <Button 
                        type="button" 
                        onClick={addBankAccount}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Account
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm">Bank Account {index + 1}</h3>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => removeBankAccount(index)}
                                    variant="destructive"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Remove
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`bankAccounts.${index}.accountName`}>Account Name:</Label>
                                <Input
                                    id={`bankAccounts.${index}.accountName`}
                                    type="text"
                                    {...control.register(`bankAccounts.${index}.accountName`)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                />
                                {errors.bankAccounts?.[index]?.accountName && (
                                    <p className="text-red-500 text-xs">{errors.bankAccounts[index]?.accountName?.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor={`bankAccounts.${index}.accountNumber`}>Account Number:</Label>
                                <Input
                                    id={`bankAccounts.${index}.accountNumber`}
                                    type="text"
                                    {...control.register(`bankAccounts.${index}.accountNumber`)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                />
                                {errors.bankAccounts?.[index]?.accountNumber && (
                                    <p className="text-red-500 text-xs">{errors.bankAccounts[index]?.accountNumber?.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor={`bankAccounts.${index}.bankName`}>Bank Name:</Label>
                                <Input
                                    id={`bankAccounts.${index}.bankName`}
                                    type="text"
                                    {...control.register(`bankAccounts.${index}.bankName`)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                />
                                {errors.bankAccounts?.[index]?.bankName && (
                                    <p className="text-red-500 text-xs">{errors.bankAccounts[index]?.bankName?.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor={`bankAccounts.${index}.branchName`}>Branch Name:</Label>
                                <Input
                                    id={`bankAccounts.${index}.branchName`}
                                    type="text"
                                    {...control.register(`bankAccounts.${index}.branchName`)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                />
                                {errors.bankAccounts?.[index]?.branchName && (
                                    <p className="text-red-500 text-xs">{errors.bankAccounts[index]?.branchName?.message}</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor={`bankAccounts.${index}.branchAddress`}>Branch Address:</Label>
                                <Input
                                    id={`bankAccounts.${index}.branchAddress`}
                                    type="text"
                                    {...control.register(`bankAccounts.${index}.branchAddress`)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                />
                                {errors.bankAccounts?.[index]?.branchAddress && (
                                    <p className="text-red-500 text-xs">{errors.bankAccounts[index]?.branchAddress?.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor={`bankAccounts.${index}.SWIFTCode`}>SWIFT Code:</Label>
                                <Input
                                    id={`bankAccounts.${index}.SWIFTCode`}
                                    type="text"
                                    {...control.register(`bankAccounts.${index}.SWIFTCode`)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                />
                                {errors.bankAccounts?.[index]?.SWIFTCode && (
                                    <p className="text-red-500 text-xs">{errors.bankAccounts[index]?.SWIFTCode?.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {errors.bankAccounts && (
                    <p className="text-red-500 text-center">{errors.bankAccounts.message}</p>
                )}

                <div className="flex justify-center pt-4">
                    <Button type="submit" variant="primaryGreen" disabled={saving}>
                        {saving ? (
                            <div className="flex items-center justify-center space-x-2">
                                <LoaderCircle size={16} className='animate-spin' />
                                <span>Saving</span>
                            </div>
                        ) : 'Save Bank Details'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BankDetailsForm;
