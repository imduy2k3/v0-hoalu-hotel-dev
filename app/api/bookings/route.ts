import { NextRequest, NextResponse } from 'next/server'
import { bookingsService, customersService } from '@/lib/data-service'

export async function GET(request: NextRequest) {
  try {
    const bookings = await bookingsService.getAll()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // First, create or find customer
    let customer = await customersService.getByEmail(body.customerEmail)
    
    if (!customer) {
      customer = await customersService.create({
        fullName: body.customerName,
        email: body.customerEmail,
        phone: body.customerPhone
      })
    }
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      )
    }
    
    // Create booking
    const booking = await bookingsService.create({
      customerId: customer.id,
      roomTypeId: body.roomTypeId,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guestsAdult: body.guestsAdult,
      guestsChild: body.guestsChild,
      roomsCount: body.roomsCount,
      nights: body.nights,
      totalAmount: body.totalAmount,
      note: body.specialRequests
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
