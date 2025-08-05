export const verifyEmailTemplate = ({name, url}) => {
    return `
     <p>Hello ${name},</p>

    <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>

     <a href="${url}" style = 
     "  display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #4f46e5;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;">
        Verify Email    
    </a>
    `
}

