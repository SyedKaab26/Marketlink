import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, city, category, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Generate a unique ticket ID for customer inquiry tracking
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `ML-CNT-${randomCode}`;
    const timestamp = new Date().toISOString();

    // Log the contact submission
    console.log(`[Contact Form Received] Ticket: ${ticketId}`, {
      name,
      email,
      phone: phone || 'N/A',
      city: city || 'Unspecified',
      category: category || 'General Inquiry',
      subject: subject || 'No Subject',
      messageLength: message.length,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Aap ka paigham hum tak pohanch gaya hai! Support team will respond within 2-4 hours.',
      details: {
        name,
        email,
        phone,
        city,
        category,
        subject,
        timestamp,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
