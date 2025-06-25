const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/enviar', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'walterdanieltorresmeza@gmail.com',
        pass: process.env.GMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"Notificador WPM" <walter.torres@outliersconsulting.com>',
      to,
      subject,
      html,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 API corriendo en http://localhost:3000');
});
