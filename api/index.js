import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Allow CORS
app.use(cors());
app.use(express.json());

/**
 * GET / — Root route for browser status check
 */
app.get("/", (req, res) => {
    res.send(`
        <h2>✅ Vercel Express API is running!</h2>
      `);
});

/**
 * POST /send-email — Trigger SendGrid email
 */
app.post("/send-email", async (req, res) => {
    const { email, subject, htmlContent } = req.body;

    // ✅ Log incoming request to Vercel logs (not visible in browser)
    console.log("📩 Email request received:", {
        email,
        subject,
        htmlPreview: htmlContent?.slice(0, 80) + "..."
    });

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const VERIFIED_DOMAIN = '"Chandria’s La Robe" <info@yourdomain.com>';
    const REPLY_TO = "support@nakkofy-ryu.site";

    const payload = {
        personalizations: [
            {
                to: [{ email }],
                subject: subject || "Something Went Wrong from the frontend"
            }
        ],
        from: { email: VERIFIED_DOMAIN },
        reply_to: { email: REPLY_TO, name: "Chandria's Support Team" },
        content: [
            {
                type: "text/html",
                value:
                    htmlContent || "<p>There's an Error from the frontend.</p>"
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
            console.error("❌ SendGrid error:", error);
            res.status(500).json({ error });
        }
    } catch (err) {
        console.error("❌ Server error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Export the app for Vercel (no .listen())
export default app;
