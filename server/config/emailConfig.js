import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "avramadrian212@gmail.com",
    pass: "whwt lkvw cnnz uang",
  },
});

export const sendPasswordResetCode = async (email, code) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Code',
    html: `You requested for a password reset. Your code is: <strong>${code}</strong>.`,
  };

  await transporter.sendMail(mailOptions);
};
