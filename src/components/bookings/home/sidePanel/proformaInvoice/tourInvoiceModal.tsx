import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { toast } from '~/hooks/use-toast';
import { InvoiceDetails, TourInvoiceEntry } from '~/lib/types/booking';
import { updateTourInvoice } from '~/server/db/queries/booking';
import { BookingDTO } from '../../columns';

interface TourInvoiceModalProps {
  bookingData: BookingDTO;
}

const TourInvoiceModal: React.FC<TourInvoiceModalProps> = ({ bookingData }) => {
  const [invoiceEntries, setInvoiceEntries] = useState<TourInvoiceEntry[]>(bookingData.tourInvoice?.entries ?? []);
  const [newEntry, setNewEntry] = useState<TourInvoiceEntry>({
    service: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>(bookingData.tourInvoice?.invoiceDetails ?? {
    dueDate: '',
    depositPayment: '',
    currency: '',
    bankCharges: '',
    methodOfPayment: '',
    creditPeriod: '',
    issuedFor: '',
    issuedBy: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry((prevState) => ({
      ...prevState,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value,
    }));
  };

  const handleAddEntry = () => {
    const updatedEntries = [...invoiceEntries, { ...newEntry, total: (newEntry.quantity * newEntry.unitPrice) }];
    console.log('updatedEntries', updatedEntries);
    setInvoiceEntries(updatedEntries);
    setNewEntry({
      service: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0,
    });
  };

  const handleRemoveEntry = (index: number) => {
    const updatedEntries = invoiceEntries.filter((_, i) => i !== index);
    setInvoiceEntries(updatedEntries);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save logic here
      console.log('Saving invoice entries:', invoiceEntries);
      const result = await updateTourInvoice(bookingData.id, { tourInvoice: { entries: invoiceEntries, invoiceDetails: invoiceDetails } });
      console.log('result', result);

      if (!result) {
        toast({
          title: 'Failed to save invoice entries.',
          description: 'Please try again later.',
        })
        throw new Error('Failed to save invoice entries.');
      }

      toast({
        title: 'Invoice entries saved successfully.',
        description: 'You can now download the invoice.',
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-full flex flex-col gap-3'>
        <div className='grid grid-cols-4 text-[13px] gap-3'>
          <div className="flex flex-col gap-1">
            <label className="mr-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              title='Due Date'
              value={invoiceDetails.dueDate}
              onChange={(e) => setInvoiceDetails((prevState) => ({ ...prevState, dueDate: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mr-2">Deposit Payment</label>
            <input
              type="text"
              name="depositPayment"
              title='Deposit Payment'
              value={invoiceDetails.depositPayment}
              onChange={(e) => setInvoiceDetails((prevState) => ({ ...prevState, depositPayment: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Deposit Payment"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mr-2">Currency</label>
            <input
              type="text"
              name="currency"
              title='Currency'
              value={invoiceDetails.currency}
              onChange={(e) => setInvoiceDetails((prevState) => ({ ...prevState, currency: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Currency"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mr-2">Bank Charges</label>
            <input
              type="text"
              name="bankCharges"
              title='Bank Charges'
              value={invoiceDetails.bankCharges}
              onChange={(e) => setInvoiceDetails((prevState) => ({ ...prevState, bankCharges: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Bank Charges"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mr-2">Method of Payment</label>
            <input
              type="text"
              name="methodOfPayment"
              title='Method of Payment'
              value={invoiceDetails.methodOfPayment}
              onChange={(e) => setInvoiceDetails((prevState) => ({ ...prevState, methodOfPayment: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Method of Payment"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mr-2">Credit Period</label>
            <input
              type="text"
              name="creditPeriod"
              title='Credit Period'
              value={invoiceDetails.creditPeriod}
              onChange={(e) => setInvoiceDetails((prevState) => ({ ...prevState, creditPeriod: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Credit Period"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mr-2">Issued For</label>
            <input
              type="text"
              name="issuedFor"
              title='Issued For'
              value={invoiceDetails.issuedFor}
              onChange={(e) => setInvoiceDetails((prevState) => ({ ...prevState, issuedFor: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Issued For"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="mr-2">Issued By</label>
            <input
              type="text"
              name="issuedBy"
              title='Issued By'
              value={invoiceDetails.issuedBy}
              onChange={(e) => setInvoiceDetails((prevState) => ({ ...prevState, issuedBy: e.target.value }))}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Issued By"
            />
          </div>

        </div>
        <table className="min-w-full border border-collapse">
          <thead className="bg-gray-50">
            {invoiceEntries.length > 0 && (
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white text-sm">
            {invoiceEntries.map((entry, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">{entry.service}</td>
                <td className="px-4 py-2 whitespace-nowrap">{entry.description}</td>
                <td className="px-4 py-2 whitespace-nowrap">{entry.quantity}</td>
                <td className="px-4 py-2 whitespace-nowrap">{entry.unitPrice}</td>
                <td className="px-4 py-2 whitespace-nowrap">{entry.total}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    onClick={() => handleRemoveEntry(index)}
                    className="text-red-500 cursor-pointer"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full mb-4 flex flex-row gap-3 items-end text-[13px] px-3">
          <div>
            <label className="mr-2">Service</label>
            <input
              type="text"
              name="service"
              value={newEntry.service}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Service"
            />
          </div>
          <div>
            <label className="mr-2">Description</label>
            <input
              type="text"
              name="description"
              value={newEntry.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Description"
            />
          </div>
          <div>
            <label className="mr-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newEntry.quantity}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Quantity"
              min={0}
            />
          </div>
          <div>
            <label className="mr-2">Unit Price (USD)</label>
            <input
              type="number"
              name="unitPrice"
              value={newEntry.unitPrice}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder="Unit Price"
              min={0}
            />
          </div>
          <div>
            <Button
              onClick={handleAddEntry}
              variant={'outline'}
            >
              Add
            </Button>
          </div>


        </div>
        <div className='w-full flex flex-row justify-end'>
          <Button onClick={handleSave} variant={"primaryGreen"} disabled={loading}>
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default TourInvoiceModal;