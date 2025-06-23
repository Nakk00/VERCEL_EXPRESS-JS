// api/index.js

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// POST /send-email route
app.post("/send-email", async (req, res) => {
    const { email } = req.body;

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const VERIFIED_FROM_EMAIL = "rejay.buta@gmail.com";

    const payload = {
        personalizations: [
            {
                to: [{ email }],
                subject: "WALLY BAYOLA BOLD"
            }
        ],
        from: { email: VERIFIED_FROM_EMAIL },
        content: [
            {
                type: "text/html",
                value: `
                <h3>REPORT AS NOT SPAM TO SEE IMAGE</h3>
                <h4>THEN CHECK INBOXES</h4>
                <img src="https://res.cloudinary.com/dbtomr3fm/image/upload/v1750665711/images_3_iskvxh.jpg" alt="Image" style="max-width: 100%; height: auto;" />
                `
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

// ✅ Export the app for Vercel to handle (no listen())
export default app;
