import { OrganizationResource, UserResource } from '@clerk/types';
import { formatDate } from 'date-fns';
import React from 'react';
import VoucherHeader from '~/components/common/voucher/VoucherHeader';
import { BookingLineWithAllData } from '~/lib/types/booking';

interface TourExpenseSheetTemplateProps {
    bookingData: BookingLineWithAllData;
    organization: OrganizationResource;
    user: UserResource
}

const TourExpenseSheetTemplate: React.FC<TourExpenseSheetTemplateProps> = ({ bookingData, organization }) => {
    return (
        <div style={{ fontSize: '13px', width: '100%', margin: '8px', padding: '8px' }}>
            <VoucherHeader organization={organization} />
            <h2 style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', margin: '10px' }}>Tour Expenses</h2>
            <table style={{ width: '95%', margin: '0 auto' }}>
            <thead>
                <tr>
                <th style={{ border: '1px solid black' }}>Expense</th>
                <th style={{ border: '1px solid black' }}>Description</th>
                <th style={{ border: '1px solid black' }}>Amount</th>
                </tr>
            </thead>
            <tbody>
                {bookingData.tourExpenses && bookingData.tourExpenses.map((expense, index) => (
                <tr key={index}>
                    <td style={{ border: '1px solid black' }}>{expense.expense}</td>
                    <td style={{ border: '1px solid black' }}>{expense.description}</td>
                    <td style={{ border: '1px solid black' }} align='right'>{expense.amount}</td>
                </tr>
                ))}
                {/* add few empty rows */}
                {[...Array(15)].map((_, index) => (
                <tr key={`empty-${index}`}>
                    <td style={{ border: '1px solid black', height: '24px' }}>{''}</td>
                    <td style={{ border: '1px solid black', height: '24px' }}>{''}</td>
                    <td style={{ border: '1px solid black', height: '24px' }}>{''}</td>
                </tr>
                ))}
                {/* Total row */}
                <tr style={{ fontWeight: 'bold' }}>
                <td></td>
                <td>Total</td>
                <td align='right'>{bookingData.tourExpenses && bookingData.tourExpenses.reduce((acc, curr) => acc + curr.amount, 0)}</td>
                </tr>
            </tbody>
            </table>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', fontWeight: 'bold' }}>
            <div>{`Tour No: ${bookingData.id}`}</div>
            <div>{`Arrival Date: ${formatDate(bookingData.startDate, 'dd/MM/yyyy')}`}</div>
            <div>{`Departure Date: ${formatDate(bookingData.startDate, 'dd/MM/yyyy')}`}</div>
            </div>

            <div>
            <div style={{ fontWeight: 'bold', fontSize: 'small' }}>Flight Details</div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <div style={{ fontWeight: 'bold' }}>
                Arrival On :
                </div>
                <div>
                {`${formatDate(bookingData.startDate, 'MMM/dd')} | ${bookingData.flightDetails?.arrivalFlight} | ${bookingData.flightDetails?.arrivalTime}`}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <div style={{ fontWeight: 'bold' }}>
                Departure On :
                </div>
                <div>
                {`${formatDate(bookingData.endDate, 'MMM/dd')} | ${bookingData.flightDetails?.departureFlight} | ${bookingData.flightDetails?.departureTime}`}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <div style={{ fontWeight: 'bold' }}>
                Clients :
                </div>
                <div>
                {bookingData.booking.client.name}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <div style={{ fontWeight: 'bold' }}>
                Guide/Driver Name :
                </div>
                <div>
                {bookingData.transportVouchers[0]?.guide?.name ?? bookingData.transportVouchers[0]?.driver?.name}
                </div>
            </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '24px' }}>
            {/* //two signature fields */}
            <div>
                <div>________________________</div>
                <div>{`Signature - Officer(Company)`}</div>
            </div>
            <div>
                <div>________________________</div>
                <div>{`Signature`}</div>
            </div>
            </div>
        </div>
    );
};

export default TourExpenseSheetTemplate;