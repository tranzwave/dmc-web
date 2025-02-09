import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '~/components/ui/dialog';
import EnhancedPaymentPackages from '../PaymentForm';

const PaymentDialog: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant={'primaryGreen'} onClick={openDialog}>Upgrade Plan</Button>
                </DialogTrigger>
                <DialogContent className='max-w-fit'>
                    <DialogHeader>
                        <DialogTitle>Upgrade Plan</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <p>Select the package and click continue</p>
                        {/* Add your form or payment details here */}
                    </DialogDescription>
                    <div>
                        <EnhancedPaymentPackages onClose={closeDialog}/>
                    </div>
                    {/* <DialogFooter>
                        <Button onClick={closeDialog}>Close</Button>
                        <Button onClick={() => {}}>Submit Payment</Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PaymentDialog;