import { NextResponse } from 'next/server';
import { deleteRestaurantById } from '~/server/db/queries/restaurants';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    console.log("Deleting restaurant with id:", id); // Check if the ID is received

    try {
        await deleteRestaurantById(id);
        return NextResponse.json({ success: true, message: "Restaurant deleted successfully" });
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        return NextResponse.json({ success: false, message: "Failed to delete restaurant", error: error }, { status: 500 });
    }
}
