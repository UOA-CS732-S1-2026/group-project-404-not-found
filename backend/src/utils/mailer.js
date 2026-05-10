import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Uni mail address 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"UoA Swap Admin" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "[UoA Swap] Your Identity Verification Code", // Email Subject
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 30px; border-radius: 10px;">
        <h2 style="color: #00467f; text-align: center;">Welcome to UoA Swap!</h2>
        <p style="font-size: 16px; color: #333; line-height: 1.5;">
          Hello,<br><br>
          Thank you for joining <strong>UoA Swap</strong>, the student marketplace for the University of Auckland. 
          To complete your registration, please enter the following verification code on the sign-up page:
        </p>
        
        <div style="background-color: #f4f7f9; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #00467f;">${code}</span>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center;">
          This code is valid for the next 10 minutes.<br>
          If you did not request this code, please ignore this email.
        </p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center;">
          <strong>UoA Swap Team</strong><br>
          University of Auckland Student Marketplace
        </p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};