import nodemailer from 'nodemailer';

export async function handler(event, context) {
  // Solo permitir métodos POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { firstName, lastName, email, phone, service, message } = JSON.parse(event.body);

    // Validación simple
    if (!firstName || !lastName || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos obligatorios.' })
      };
    }

    // Configura tu transporte de correo
    const transporter = nodemailer.createTransport({ // createTransport es el método correcto
      service: 'gmail',
      auth: {
        user: 'daspix.contacto@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Opciones del correo
    const mailOptions = {
      from: email,
      to: 'daspix.contacto@gmail.com',
      subject: `Nuevo mensaje de contacto de ${firstName} ${lastName}`,
      text: `
Nombre: ${firstName} ${lastName}
Email: ${email}
Teléfono: ${phone || 'No proporcionado'}
Servicio: ${service || 'No seleccionado'}
Mensaje: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ success: true, message: 'Mensaje enviado correctamente.' })
    };

  } catch (error) {
    console.log('Error detallado:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Hubo un problema al intentar enviar el correo.' })
    };
  }
};