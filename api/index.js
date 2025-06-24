// api/index.js

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Allow CORS
app.use(cors());
app.use(express.json());

// POST /send-email route
app.post("/send-email", async (req, res) => {
    const { email, subject, htmlContent } = req.body;

    // Required for SendGrid authentication
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const VERIFIED_FROM_EMAIL = "rejay.buta@gmail.com"; // Change if needed

    // Create the email payload
    const payload = {
        personalizations: [
            {
                to: [{ email }],
                subject: subject || "Something Went Wrong from the frontend"
            }
        ],
        from: { email: VERIFIED_FROM_EMAIL },
        content: [
            {
                type: "text/html",
                value: htmlContent || "<p>There's an Error from the frontend.</p>" // fallback HTML
            }
        ]
    };

    try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${SENDGRID_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            res.status(200).json({ message: "✅ Email sent!" });
        } else {
            const error = await response.text();
            res.status(500).json({ error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export the app for Vercel
export default app;
