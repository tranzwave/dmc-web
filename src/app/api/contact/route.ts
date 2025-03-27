import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "subject", "message"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Create a Nodemailer transporter (Using Gmail SMTP as an example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email (e.g., youremail@gmail.com)
        pass: process.env.EMAIL_PASS, // App Password or SMTP password
      },
    });

    // Email configuration (sent to you)
    const mailOptions = {
      from: `"${body.firstName} ${body.lastName}" <${body.email}>`,
      to: process.env.NOTIFICATION_EMAIL, // Your email (to receive form submissions)
      subject: `New Contact Form Submission: ${body.subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <p><strong>Message:</strong> ${body.message}</p>
      `,
    };

    // Send the email
    const sentInfo = await transporter.sendMail(mailOptions);

    // Log the email response
    console.log("Contact form email sent:", sentInfo);

    if(sentInfo.accepted.length === 0) {
        return NextResponse.json({ error: "Failed to send contact form email" }, { status: 500 });
        }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully. You will receive an email notification.",
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to process contact form submission" }, { status: 500 });
  }
}
