export const sellerApprovedTemplate = ({ name, store_name }) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seller Application Approved</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
            .header { font-size: 24px; font-weight: bold; color: #4CAF50; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 3px; }
            .footer { margin-top: 20px; font-size: 12px; color: #777; }
        </style>
    </head>
    <body>
        <div class="container">
            <p class="header">Congratulations, ${name}!</p>
            <p>We are pleased to inform you that your application to become a seller on e-haat has been approved.</p>
            <p>Your store, <strong>${store_name}</strong>, is now active. You can log in to your account and start listing your products right away.</p>
            <p>
                <a href="${process.env.FRONTEND_URL}/seller/dashboard" class="button">Go to Your Seller Dashboard</a>
            </p>
            <p>We are excited to see what you bring to our marketplace!</p>
            <p class="footer">
                Best regards,<br>
                The e-haat Team
            </p>
        </div>
    </body>
    </html>
    `;
};