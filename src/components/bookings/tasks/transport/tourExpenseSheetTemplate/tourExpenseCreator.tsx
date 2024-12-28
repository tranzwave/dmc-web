import React, { useState } from 'react';
import { toast } from '~/hooks/use-toast';
import { Button } from '~/components/ui/button';
import { updateTourExpenses } from '~/server/db/queries/booking';
import { BookingLineWithAllData, FlightDetails, TourExpense } from '~/lib/types/booking';



interface TourExpenseCreatorProps {
    bookingData: BookingLineWithAllData;
}

const TourExpenseCreator: React.FC<TourExpenseCreatorProps> = ({ bookingData }) => {
    const [tourExpenses, setTourExpenses] = useState<TourExpense[]>(bookingData.tourExpenses ?? []);
    const [newTourExpense, setNewTourExpense] = useState<TourExpense>({ expense: '', description: '', amount: 0 });
    const [flightDetails, setFlightDetails] = useState<FlightDetails>(bookingData.flightDetails ?? {
        arrivalFlight: '',
        arrivalTime: '',
        arrivalDate: '',
        departureFlight: '',
        departureTime: '',
        departureDate: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTourExpense(prevState => ({ ...prevState, [name]: name === 'amount' ? Number(value) : value }));
    };

    const handleFlightDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFlightDetails(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddExpense = () => {
        if (!newTourExpense.expense || !newTourExpense.description || newTourExpense.amount <= 0) {
            alert('Please fill in all fields with valid values');
            return;
        }
        const updatedExpenses = [...tourExpenses, newTourExpense];
        setTourExpenses(updatedExpenses);
        setNewTourExpense({ expense: '', description: '', amount: 0 });
    };

    const handleRemoveExpense = (index: number) => {
        const updatedExpenses = tourExpenses.filter((_, i) => i !== index);
        setTourExpenses(updatedExpenses);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const result = await updateTourExpenses(bookingData.id, { tourExpenses, flightDetails });
            if (!result) {
                throw new Error("Couldn't update tour expenses");
            }
            toast({
                title: "Success!",
                description: "Tour expenses updated successfully.",
                duration: 5000,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Uh Oh!",
                description: "Failed to update tour expenses list.",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full'>

            <div className="w-full mb-4 flex flex-col gap-2 text-[13px]">
                <div className='font-bold'>Arrival Flight Details</div>
                <div className="w-full flex flex-row gap-2">
                    <input
                        type="text"
                        name="arrivalFlight"
                        value={flightDetails.arrivalFlight}
                        onChange={handleFlightDetailsChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Arrival Flight"
                    />
                    <input
                        type="time"
                        name="arrivalTime"
                        value={flightDetails.arrivalTime}
                        onChange={handleFlightDetailsChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Arrival Time"
                    />
                    <input
                        type="date"
                        name="arrivalDate"
                        value={flightDetails.arrivalDate}
                        onChange={handleFlightDetailsChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Arrival Date"
                    />

                </div>
                <div className='font-bold'>Departure Flight Details</div>
                <div className="w-full flex flex-row gap-2">
                    <input
                        type="text"
                        name="departureFlight"
                        value={flightDetails.departureFlight}
                        onChange={handleFlightDetailsChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Departure Flight"
                    />
                    <input
                        type="time"
                        name="departureTime"
                        value={flightDetails.departureTime}
                        onChange={handleFlightDetailsChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Departure Time"
                    />
                    <input
                        type="date"
                        name="departureDate"
                        value={flightDetails.departureDate}
                        onChange={handleFlightDetailsChange}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Departure Date"
                    />
                </div>
            </div>
            <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expense</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white text-sm">
                    {tourExpenses.map((expense, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">{expense.expense}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{expense.description}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{expense.amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <button
                                    onClick={() => handleRemoveExpense(index)}
                                    className="text-red-500 cursor-pointer"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="w-full mb-4 flex flex-row items-center text-[13px]">
                <input
                    type="text"
                    name="expense"
                    value={newTourExpense.expense}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-2 py-1 mr-2"
                    placeholder="Expense"
                />
                <input
                    type="text"
                    name="description"
                    value={newTourExpense.description}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-2 py-1 mr-2"
                    placeholder="Description"
                />
                <input
                    type="number"
                    name="amount"
                    value={newTourExpense.amount}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-2 py-1 mr-2"
                    placeholder="Amount"
                    min={0}
                />
                <Button
                    onClick={handleAddExpense}
                    variant={'outline'}
                >
                    Add
                </Button>
            </div>
            <div className='mt-4'>
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
    );
};

export default TourExpenseCreator;