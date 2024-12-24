import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { updateTourPacketList } from '~/server/db/queries/booking';
import { TourPacket } from '~/lib/types/booking';
import { toast } from '~/hooks/use-toast';
import { BookingDTO } from '../columns';
import { OrganizationResource, UserResource } from '@clerk/types';
import VoucherButton from '../../tasks/hotelsTaskTab/taskTab/VoucherButton';
import TourPacketCheckListPDF from './tourPacketCheckListDocument';

interface Document {
    no: number;
    item: string;
    count: number;
}

interface NewDocument {
    no: string;
    item: string;
    count: string | number;
}

interface Item {
    no: number;
    item: string;
    count: number;
}

interface NewItem {
    no: string;
    item: string;
    count: string | number;
}

interface TourPacketCheckListProps {
    bookingData: BookingDTO;
    organization: OrganizationResource;
    user: UserResource;
}

const TourPacketCheckList: React.FC<TourPacketCheckListProps> = ({ bookingData, organization, user }) => {
    const [documents, setDocuments] = useState<Document[]>(bookingData.tourPacket?.documents.map((d, i) => ({ ...d, no: i + 1 })) ?? []);
    const [newDocument, setNewDocument] = useState<NewDocument>({ no: '', item: '', count: '' });

    const [items, setItems] = useState<Item[]>(bookingData.tourPacket?.accessories.map((a, i) => ({ ...a, no: i + 1 })) ?? []);
    const [newItem, setNewItem] = useState<NewItem>({ no: '', item: '', count: '' });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<NewDocument | NewItem>>) => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: name === 'count' ? Number(value) : value }));
    };

    const handleAddDocument = () => {
        if (!newDocument.item || !newDocument.count) {
            alert('Please fill in all fields');
            return;
        }
        setDocuments([...documents, { ...newDocument, no: documents.length + 1, count: Number(newDocument.count) }]);
        setNewDocument({ no: '', item: '', count: '' });
    };

    const handleAddItem = () => {
        if (!newItem.item || !newItem.count) {
            alert('Please fill in all fields');
            return;
        }
        setItems([...items, { ...newItem, no: items.length + 1, count: Number(newItem.count) }]);
        setNewItem({ no: '', item: '', count: '' });
    };

    const handleRemoveDocument = (index: number) => {
        const updatedDocuments = documents.filter((_, i) => i !== index);
        setDocuments(updatedDocuments);
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const tourPacket: TourPacket = {
                documents: documents.map(d => { return { item: d.item, count: d.count } }),
                accessories: items.map(i => { return { item: i.item, count: i.count } })
            }; // Adjust this according to your actual TourPacket structure
            await updateTourPacketList(bookingData.id, tourPacket);
            // Close the dialog or show a success message
            toast({
                title: "Success!",
                description: "Tour packet list updated successfully.",
                duration: 5000,
            });
        } catch (error) {
            console.error("Error updating tour packet list:", error);
            toast({
                title: "Uh Oh!",
                description: "Failed to update tour packet list.",
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='my-2 flex flex-row justify-end'>
                <VoucherButton buttonText='Download Checklist as PDF' voucherComponent={
                    <div>
                        <TourPacketCheckListPDF organization={organization} user={user as UserResource} bookingData={bookingData} />
                    </div>
                } />
            </div>
            <Tabs defaultValue='Documents'>
                <TabsList className="flex border-b border-gray-300">
                    <TabsTrigger value='Documents' className="px-4 py-2 cursor-pointer focus:outline-none hover:text-primary-green">
                        Documents
                    </TabsTrigger>
                    <TabsTrigger value='Items' className="px-4 py-2 cursor-pointer focus:outline-none hover:text-primary-green">
                        Tour Accessories
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='Documents' className="p-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            name="item"
                            value={newDocument.item}
                            onChange={(e) => handleInputChange(e, setNewDocument)}
                            className="border rounded px-2 py-1 mr-2 text-[13px]"
                            placeholder="Item"

                        />
                        <input
                            type="number"
                            name="count"
                            value={newDocument.count}
                            onChange={(e) => handleInputChange(e, setNewDocument)}
                            className="border rounded px-2 py-1 mr-2 text-[13px]"
                            placeholder="Count"
                            min={0}
                        />
                        <Button onClick={handleAddDocument} variant={"primaryGreen"}>Add</Button>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {documents.map((doc, index) => (
                                <tr key={index}>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">{doc.no}</td> */}
                                    <td className="px-6 py-4 whitespace-nowrap">{doc.item}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{doc.count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button title="close" onClick={() => handleRemoveDocument(index)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TabsContent>
                <TabsContent value='Items' className="p-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            name="item"
                            value={newItem.item}
                            onChange={(e) => handleInputChange(e, setNewItem)}
                            className="border rounded px-2 py-1 mr-2 text-[13px]"
                            placeholder="Item"
                        />
                        <input
                            type="number"
                            name="count"
                            value={newItem.count}
                            onChange={(e) => handleInputChange(e, setNewItem)}
                            className="border rounded px-2 py-1 mr-2 text-[13px]"
                            placeholder="Count"
                            min={0}
                        />
                        <Button onClick={handleAddItem} variant={"primaryGreen"}>Add</Button>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {items.map((item, index) => (
                                <tr key={index}>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">{item.no}</td> */}
                                    <td className="px-6 py-4 whitespace-nowrap">{item.item}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button title="close" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TabsContent>
            </Tabs>
            {/* Save Button */}
            <div className="w-full mt-4">
                <Button onClick={handleSave} variant={"primaryGreen"} disabled={loading} className='w-full'>
                    {loading ? (
                        <div className='flex flex-row items-center gap-2'>
                            <LoaderCircle size={16} className="mr-2 animate-spin" />
                            <div>Saving</div>
                        </div>
                    ) : (
                        'Save'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default TourPacketCheckList;