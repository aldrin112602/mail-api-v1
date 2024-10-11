const nodemailer = require('nodemailer');

const emailController = {
    sendEmail: async (req, res) => {
        const { recipient, subject, text, from_name, from_mail } = req.body;

        if (!recipient || !subject || !text || !from_name || !from_mail) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Decode base64 encoded email and password
        const decodedUser = Buffer.from('Y2FiYWxsZXJvYWxkcmluMDJAZ21haWwuY29t', 'base64').toString('utf8');
        const decodedPass = Buffer.from('aWd0cHBsaGlnem1laGRqYw==', 'base64').toString('utf8');

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true, // use SSL
            auth: {
                user: decodedUser,
                pass: decodedPass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const from = from_mail 
            ? `"${from_name || 'No-Reply'}" <${from_mail}>` 
            : `"Aldrin Caballero 👻" <caballeroaldrin02@gmail.com>`;

        const mailOptions = {
            from,
            to: recipient,
            subject,
            text,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            } else {
                return res.status(200).json({ message: 'Email sent successfully', info });
            }
        });
    }
};

module.exports = emailController;
