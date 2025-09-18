import { NextRequest, NextResponse } from 'next/server'
import { customersService } from '@/lib/data-service'

export async function GET(request: NextRequest) {
  try {
    const customers = await customersService.getAll()
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const customer = await customersService.create({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone
    })
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
