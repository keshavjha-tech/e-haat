export const resetPasswordTemplate = ({ name, otp }) => {
    return `
     <p>Hello ${name},</p>

     <p>We received a request to reset your password for your account.</p>

     <p>Your One-Time Password (OTP) is:</p>

     <div style = font-size:24px >${otp}</div>

     <p>This OTP is valid for <strong>5 minutes</strong>.</p>
     <p>If you did not request this, you can safely ignore this email.</p>

     <p>Thanks,<br> E-haat</p>

    `
}