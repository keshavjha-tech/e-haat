

export const accountSuspendedTemplate = ({ name }) => {
    return `
        <p>Hello ${name},</p>
        <p>This is an urgent notification regarding your seller account on e-haat.</p>
        <p>Your account has been suspended due to multiple violations of our platform policies, as verified by our administrative team.</p>
        <p>As a result, your selling privileges have been revoked, and all of your product listings have been unpublished.</p>
        <p>If you believe this is an error, please contact our support team.</p>
        <p>Sincerely,<br>The e-haat Team</p>
    `;
};