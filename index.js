const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // <<---- Importar variables del .env

const app = express();
app.use(express.json());
app.use(cors());

// Función para elegir Gmail o Outlook según .env
const getTransporter = () => {
  if (process.env.CORREO_TIPO === 'OUTLOOK') {
    return nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASS,
      },
    });
  } else {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }
};

app.post('/enviar', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const transporter = getTransporter(); // Usar la función

    const info = await transporter.sendMail({
      from: '"Notificador WPM" <no-reply@notificaciones.com>',
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
