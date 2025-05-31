import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const server = new SMTPServer({
  // Allow plain auth (for testing; set to false in production)
  authOptional: true,
  allowInsecureAuth: true,

  // Log incoming connection
  onConnect(session, cb) {
    console.log(`📥 Incoming connection from: ${session.remoteAddress}`);
    cb(); // Accept connection
  },

  // Log MAIL FROM address
  onMailFrom(address, session, cb) {
    console.log(`📨 MAIL FROM: ${address.address}`);
    cb(); // Accept sender
  },

  // Log RCPT TO address
  onRcptTo(address, session, cb) {
    console.log(`📥 RCPT TO: ${address.address}`);
    cb(); // Accept recipient
  },

  // Handle full email data
  onData(stream, session, cb) {
    simpleParser(stream, async (err, parsed) => {
      if (err) {
        console.error("❌ Failed to parse email:", err);
        return cb(err);
      }

      const emailData = {
        from: parsed.from?.text || '',
        to: parsed.to?.text || '',
        subject: parsed.subject || '',
        text: parsed.text || '',
        html: parsed.html || '',
        date: parsed.date || new Date()
      };

      console.log("✅ Email received & parsed:", emailData);

      // Optional: Send to your backend (e.g., to store in DB)
      try {
        await axios.post(`${process.env.EXPRESS_URL}`, emailData);
        console.log("📤 Email sent to backend");
      } catch (error) {
        console.error("❌ Failed to send to backend:", error);
      }

      cb(); // Done
    });
  }
});

const PORT = 2525; // Choose an open port
server.listen(PORT, () => {
  console.log(`🚀 SMTP server is running and listening on port ${PORT}`);
});
