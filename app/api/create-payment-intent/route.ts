import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@clerk/nextjs'

// Make sure STRIPE_SECRET_KEY is properly set
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
})

export async function POST(request: Request) {
  try {
    // Get user authentication
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User not authenticated' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      )
    }

    console.log('Creating payment intent:', {
      amount: Math.round(amount * 100),
      currency: 'inr',
      userId
    })

    // Create PaymentIntent with card payments only
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      payment_method_types: ['card'],
      metadata: {
        userId,
      },
      description: `Taxi Booking Payment for user ${userId}`,
    })

    console.log('Payment intent created successfully:', paymentIntent.id)

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    // Log the detailed error
    console.error('Stripe payment intent creation failed:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    })

    // Return a more specific error message if possible
    const errorMessage = error instanceof Error 
      ? error.message
      : 'An unexpected error occurred while creating the payment intent'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
