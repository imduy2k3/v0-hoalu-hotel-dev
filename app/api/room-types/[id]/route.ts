import { NextRequest, NextResponse } from 'next/server'
import { roomTypesService } from '@/lib/data-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomType = await roomTypesService.getById(params.id)
    
    if (!roomType) {
      return NextResponse.json(
        { error: 'Room type not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(roomType)
  } catch (error) {
    console.error('Error fetching room type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch room type' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log('Updating room type:', params.id, body)
    
    // First check if room type exists
    const existingRoomType = await roomTypesService.getById(params.id)
    if (!existingRoomType) {
      console.log('Room type not found:', params.id)
      return NextResponse.json(
        { error: 'Room type not found' },
        { status: 404 }
      )
    }
    
    console.log('Room type exists, updating:', existingRoomType)
    const updatedRoomType = await roomTypesService.update(params.id, body)
    
    if (!updatedRoomType) {
      console.log('Update failed for room type:', params.id)
      return NextResponse.json(
        { error: 'Failed to update room type' },
        { status: 500 }
      )
    }
    
    console.log('Room type updated successfully:', updatedRoomType)
    return NextResponse.json({
      success: true,
      roomType: updatedRoomType,
      message: 'Cập nhật loại phòng thành công'
    })
  } catch (error) {
    console.error('Error updating room type:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { 
        error: 'Failed to update room type',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
