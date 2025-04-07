import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    
    let roomId;
    let isUnique = false;
    
    while (!isUnique) {
      roomId = nanoid(5);
      
      // const roomsData = await client.graphql({
      //   query: listRooms,
      //   variables: {
      //     filter: {
      //       id: { eq: roomId }
      //     }
      //   }
      // });
      
      // If no rooms with this ID exist, we're good to go
      // if (roomsData.data.listRooms.items.length === 0) {
      //   isUnique = true;
      // }
      isUnique = true
    }
    
    // Create the room in Amplify
    // await client.graphql({
    //   query: createRoom,
    //   variables: {
    //     input: {
    //       id: roomId,
    //       createdAt: new Date().toISOString(),
    //       // Add any other room properties you need
    //     }
    //   }
    // });
    
    // Return the room ID
    return NextResponse.json({ roomId });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}