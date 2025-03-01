import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import multer from "multer";
import { promisify } from "util";
import fs from "fs";
import path from "path";

// Multer setup for handling file upload
const upload = multer({ dest: "/tmp" });
const uploadMiddleware = promisify(upload.single("file"));

export async function POST(req: NextRequest) {
  try {
    // Handle FormData parsing
    await uploadMiddleware(req as any, {} as any);

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const file = formData.get("file") as File | null;

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare mail options
    const mailOptions: any = {
      from: process.env.EMAIL_USER,
      to: "jaypostonesdrums@gmail.com, jeffh.84@gmail.com",
      subject: `Bug Report: ${title} [${priority.toUpperCase()}]`,
      text: `Title: ${title}\nPriority: ${priority}\n\nDescription:\n${description}`,
      attachments: [],
    };

    // Attach file if provided
    if (file) {
      const tempFilePath = `/tmp/${file.name}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(tempFilePath, new Uint8Array(buffer));

      mailOptions.attachments.push({
        filename: file.name,
        path: tempFilePath,
      });
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Bug report sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 }
    );
  }
}
