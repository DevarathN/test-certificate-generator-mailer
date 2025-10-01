const { schema } = require('../validation');
const { sanitizeInput } = require('../utils');
const { renderCertificateToBuffers } = require('../pdfGenerator');
const { createTransporter } = require('../mailer');

exports.generateCertificate = async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ ok: false, errors: error.details.map(d => d.message) });

    const safe = {
      name: sanitizeInput(value.name),
      email: sanitizeInput(value.email),
      gstNumber: sanitizeInput(value.gstNumber.toUpperCase()),
      businessName: sanitizeInput(value.businessName),
      businessAddress: sanitizeInput(value.businessAddress),
      date: new Date().toLocaleDateString('en-GB')
    };

    const { pdfBuffer, screenshotBuffer } = await renderCertificateToBuffers(safe);
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: safe.email,
      subject: 'Your Certificate',
      text: `Hi ${safe.name},\nPlease find your certificate attached.`,
      attachments: [
        { filename: 'certificate.pdf', content: pdfBuffer },
        { filename: 'certificate.jpg', content: screenshotBuffer }
      ]
    });

    res.json({ ok: true, message: 'Certificate generated and emailed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
