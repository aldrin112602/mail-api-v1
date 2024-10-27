const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const emailController = {
  sendEmail: async (req, res) => {
    const { recipient, subject, text, html, from_name, from_mail } = req.body;

    if (!recipient || !subject || (!text && !html)) {
      return res.status(400).json({
        message: "All fields are required",
        fields: [
          "recipient: required",
          "subject: required",
          "text or html: required",
          "from_name: optional",
          "from_mail: optional",
        ],
        sample_body: {
          recipient: "receiver@gmail.com",
          subject: "Test mail",
          text: "This is a test email.",
          html: "<p>This is a <strong>test</strong> email.</p>",
          from_name: "Aldrin Caballero",
          from_mail: "caballeroaldrin02@gmail.com",
        },
      });
    }

    const { USER_EMAIL, USER_PASSWORD } = process.env;
    const decodedUser = Buffer.from(USER_EMAIL, "base64").toString("utf8");
    const decodedPass = Buffer.from(USER_PASSWORD, "base64").toString("utf8");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: decodedUser,
        pass: decodedPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const from = from_mail
      ? `"${from_name || "No-Reply"}" <${from_mail}>`
      : `"Aldrin Caballero 👻" <caballeroaldrin02@gmail.com>`;

    const mailOptions = {
      from,
      to: recipient,
      subject,
      text,
      html, // Add html option for HTML content
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email", error });
      } else {
        // Save email details to a JSON file
        const emailDetails = {
          recipient,
          subject,
          text,
          html,
          from_name: from_name || "No-Reply",
          from_mail: from_mail || "caballeroaldrin02@gmail.com",
          timestamp: new Date(),
        };

        const filePath = path.join(__dirname, "../submitted_emails_data.json");

        fs.readFile(filePath, (err, data) => {
          let emails = [];
          if (!err && data.length > 0) {
            emails = JSON.parse(data);
          }

          emails.push(emailDetails);

          fs.writeFile(filePath, JSON.stringify(emails, null, 2), (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Internal server error", err });
            }
            return res
              .status(200)
              .json({ message: "Email sent successfully", info });
          });
        });
      }
    });
  },

  getLogs: async (req, res) => {
    const token = req.headers['x-access-token'];
    const validToken = process.env.ACCESS_TOKEN;
    if (!token || token !== validToken) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const filePath = path.join(__dirname, "../submitted_emails_data.json");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Error reading email logs", error: err });
      }

      if (data.length === 0) {
        return res.status(200).json({ message: "No emails found", emails: [] });
      }

      const emails = JSON.parse(data);
      return res.status(200).json({ emails });
    });
  },
};

module.exports = emailController;
