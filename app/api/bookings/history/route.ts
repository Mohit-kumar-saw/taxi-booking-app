import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

export async function GET(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User not authenticated' },
        { status: 401 }
      )
    }

    // In a real application, you would fetch this from a database
    // For now, we'll get it from localStorage on the client side
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error fetching booking history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking history' },
      { status: 500 }
    )
  }
}
