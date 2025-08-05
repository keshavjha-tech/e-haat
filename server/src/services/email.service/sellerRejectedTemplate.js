export const sellerRejectedTemplate = ({ name }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seller Application Update</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .header { font-size: 24px; font-weight: bold; }
            .footer { margin-top: 20px; font-size: 12px; color: #777; }
        </style>
    </head>
    <body>
        <div class="container">
            <p class="header">Update on Your Seller Application</p>
            <p>Hello ${name},</p>
            <p>Thank you for your interest in becoming a seller on e-haat.</p>
            <p>After careful review, we regret to inform you that your application was not approved at this time. We receive many applications and our selection process is competitive.</p>
            <p>We appreciate you taking the time to apply and wish you the best in your future endeavors.</p>
            <p class="footer">
                Sincerely,<br>
                The e-haat Team
            </p>
        </div>
    </body>
    </html>
    `;
};