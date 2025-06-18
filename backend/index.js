const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para recibir el formulario
app.post('/contact', async (req, res) => {
  const { firstName, lastName, email, phone, service, message } = req.body;

  // Validación simple
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  // Configura tu transporte de correo (ejemplo con Gmail)
  const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // true para puerto 465, false para 587
  auth: {
    user: 'contacto@daspix.cl',
    pass: 'TU_CONTRASEÑA_DE_ZOHO'
  }
});

  // Opciones del correo
  const mailOptions = {
    from: email,
    to: 'contacto@daspix.com', // Cambia por tu correo de recepción
    subject: `Nuevo mensaje de contacto de ${firstName} ${lastName}`,
    text: `
Nombre: ${firstName} ${lastName}
Email: ${email}
Teléfono: ${phone || 'No proporcionado'}
Servicio: ${service || 'No seleccionado'}
Mensaje: ${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el mensaje.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://www.daspix.cl`);
});