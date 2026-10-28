import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { randomUUID } from 'node:crypto';

const app = express();
const upload = multer({storage:multer.memoryStorage(), limits:{fileSize:8*1024*1024}, fileFilter:(_req,file,cb)=>{
  const allowed = ['image/png','image/jpeg','image/webp','application/pdf'];
  cb(allowed.includes(file.mimetype) ? null : new Error('Adjunta una imagen PNG, JPG, WEBP o un PDF.'), allowed.includes(file.mimetype));
}});
const storeEmail = process.env.STORE_EMAIL || 'sebastianplasencia313@gmail.com';
const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'https://scplasenciac.github.io,http://localhost:5173,http://127.0.0.1:5173').split(',').map(origin => origin.trim()).filter(Boolean);
app.use((req,res,next) => {
  const origin = req.headers.origin;
  if (origin && frontendOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.get('/health', (_req,res) => res.json({ok:true}));
app.post('/api/orders', upload.single('receipt'), async (req,res) => {
  try {
    if (!req.file) return res.status(400).json({error:'Adjunta el comprobante de pago.'});
    const order = JSON.parse(req.body.order || '{}');
    if (!order.customer || !order.email || !order.region || !order.district || !order.items?.length || !Number.isFinite(order.total)) return res.status(400).json({error:'Faltan datos del pedido. Regresa al paso de entrega y completa el formulario.'});
    const required = ['SMTP_HOST','SMTP_USER','SMTP_PASS'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length) return res.status(503).json({error:'La tienda aún debe configurar el envío de correos. Contacta a Astral Brand por WhatsApp para completar tu compra.'});
    const orderId = 'AB-' + randomUUID().slice(0,8).toUpperCase();
    const newline = String.fromCharCode(10);
    const lines = order.items.map((item,index) => (index+1)+'. '+(item.collection ? item.collection+' · ' : '')+item.name+' — talla '+item.size+' — S/ '+item.price).join(newline);
    const delivery = [
      'Entrega: '+(order.deliveryMethod||'Recojo en agencia'),
      'Zona de entrega: '+order.district+', '+order.region,
      'Modalidad de entrega: '+(order.deliveryMethod||'Por coordinar'),
      'Agencia Shalom: '+(order.agency?.name || 'Por coordinar según el distrito'),
      'Referencia de ubicación: '+(order.agency?.address || order.district+', '+order.region),
      'Plazo estimado de recepción: '+(order.estimatedDelivery||'2-4 días hábiles')
    ].join(newline);
    const message = [
      'PEDIDO '+orderId,
      '',
      'Cliente: '+order.customer,
      'Correo: '+order.email,
      'Entrega: '+(order.deliveryMethod||'Recojo en agencia'),
      'Zona de entrega: '+order.district+', '+order.region,
      'Modalidad de entrega: '+order.deliveryMethod,
      'Agencia Shalom: '+(order.agency?.name || 'Por coordinar según el distrito'),
      'Referencia de ubicación: '+(order.agency?.address || order.district+', '+order.region),
      'Plazo estimado de recepción: '+(order.estimatedDelivery||'2–4 días hábiles'),
      'Método de pago: '+order.payment,
      '', lines, '',
      'Subtotal: S/ '+order.subtotal,
      'Envío: '+(order.shipping===0?'Gratis':'S/ '+order.shipping),
      'Total: S/ '+order.total,
      '', 'Comprobante adjunto.'
    ].join(newline);
    const confirmationMessage = [
      'Hola '+order.customer+',',
      '',
      'Tu compra fue realizada con éxito. Recibimos tu comprobante y estamos verificando el pago.',
      'Código de compra: '+orderId,
      '',
      delivery,
      'Método de pago: '+order.payment,
      '', 'Productos:', lines, '',
      'Subtotal: S/ '+order.subtotal,
      'Envío: '+(order.shipping===0?'Gratis':'S/ '+order.shipping),
      'Total: S/ '+order.total,
      '', 'Cualquier duda, comunícate con nosotros por WhatsApp al +51 957 391 382.',
      '', 'Astral Brand'
    ].join(newline);
    const transporter = nodemailer.createTransport({host:process.env.SMTP_HOST, port:Number(process.env.SMTP_PORT||587), secure:Number(process.env.SMTP_PORT)===465, auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await Promise.all([
      transporter.sendMail({
        from, to:storeEmail, replyTo:order.email,
        subject:'Nuevo pedido '+orderId+' — Astral Brand', text:message,
        attachments:[{filename:req.file.originalname,content:req.file.buffer,contentType:req.file.mimetype}]
      }),
      transporter.sendMail({
        from, to:order.email,
        subject:'Tu compra fue realizada con éxito — '+orderId+' | Astral Brand',
        text:confirmationMessage
      })
    ]);
    res.json({ok:true,orderId});
  } catch (error) {
    console.error('Order email failed:',error);
    res.status(500).json({error:'No pudimos enviar el comprobante. Intenta nuevamente o contáctanos por WhatsApp.'});
  }
});
app.use((error,_req,res,_next)=>{
  const message = error.code === 'LIMIT_FILE_SIZE' ? 'El archivo debe pesar menos de 8 MB.' : error.message;
  res.status(400).json({error:message || 'No pudimos leer el archivo adjunto.'});
});
const port = Number(process.env.PORT || 3001);
app.listen(port,'0.0.0.0',()=>console.log('Astral order API listening on '+port));
