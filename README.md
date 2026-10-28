# Astral Brand

Tienda React + Vite con checkout y API para recibir comprobantes.

## Iniciar en local

1. Copia `.env.example` como `.env`.
2. Para que la API envíe correos, configura una cuenta de Brevo, verifica el remitente y agrega `BREVO_API_KEY` y `EMAIL_FROM` al archivo `.env`. El destinatario de la tienda ya está establecido en `sebastianplasencia313@gmail.com`.
3. Los datos de Yape/Plin y de la cuenta bancaria muestran un aviso genérico temporal. Actualiza `PAYMENT_DETAILS` en `src/main.jsx` cuando tengas los datos definitivos.
4. Ejecuta `npm install` y `npm run dev`.

El pedido solo se confirma cuando la API envía correctamente los dos correos: el aviso para la tienda con el comprobante adjunto y la confirmación con el código de compra para el cliente. Mantén la clave de Brevo en `.env`; nunca la publiques.

## Envíos y promoción

En checkout se solicitan departamento/región y distrito. El envío es gratis para San Borja o Miraflores en Lima; para cualquier otro punto cuesta S/ 12 y se despacha a la agencia Shalom más cercana a la zona indicada. El enlace al directorio de agencias está disponible en el checkout y en la confirmación. El plazo estimado es de 2 a 4 días hábiles. Los polos cuestan S/ 65 y la promoción calcula 2 por S/ 120.

## Medios de pago

Yape/Plin y depósito en cuenta están disponibles como opciones del checkout. Por ahora se muestra un texto genérico indicando que los datos de pago se publicarán pronto. Actualiza `PAYMENT_DETAILS` cuando tengas los datos definitivos. La carga acepta PNG, JPG, WEBP o PDF de hasta 8 MB.

## Imágenes y colecciones

Los seis polos y el logo están en `public/assets`. El catálogo se genera desde el arreglo `collections` de `src/main.jsx`. Para añadir una colección, agrega un objeto con su `id`, `name`, `number`, `eyebrow`, `description`, `price` y `products`. Cada producto conserva el formato `[artista, nombre del diseño, color de respaldo, símbolo, ruta de imagen]`. La oferta es opcional y se configura con `offer` usando `quantity`, `total` y `label`.

## Subir a GitHub

Para subir cambios después de haber conectado el repositorio:

```powershell
git add .
git commit -m "Describe el cambio"
git push
```

Git ignora `.env` y `node_modules` por medio de `.gitignore`.

## Publicar en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila Vite y publica `dist` al hacer push a `main`. En GitHub, abre **Settings > Pages** y selecciona **GitHub Actions** como fuente. Vite usa `/astralbrand/` como ruta base.

GitHub Pages publica la interfaz estática; no ejecuta `server.mjs`. La API Node debe desplegarse como servicio aparte. En GitHub, crea la variable de Actions `VITE_ORDER_API_URL` con la URL completa del endpoint, por ejemplo `https://astralbrand-api.onrender.com/api/orders`. El workflow publica una nueva versión de Pages cuando esta variable está configurada.

## API en Render Free

Crea un **Web Service** conectado al repositorio. Usa:

- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/health`
- Root Directory: vacío

Render Free no permite conexiones salientes por SMTP; esta API usa la API HTTPS de Brevo. En **Environment Variables** configura:

- `STORE_EMAIL`: `sebastianplasencia313@gmail.com`
- `BREVO_API_KEY`: la clave secreta API de Brevo
- `EMAIL_FROM`: el correo que hayas verificado como remitente en Brevo
- `EMAIL_FROM_NAME`: `Astral Brand`
- `FRONTEND_ORIGIN`: `https://scplasenciac.github.io`

No agregues comillas a los valores. Al guardar las variables, Render vuelve a desplegar el servicio. El remitente debe estar verificado en Brevo antes de hacer una compra real. La API de envío se conecta por HTTPS y puede enviar a direcciones de Gmail, Outlook/Hotmail u otros proveedores.

Para desarrollo local, configura esas mismas variables en un archivo `.env` basado en `.env.example`. El endpoint `/health` debe responder `{"ok":true}` cuando la API esté disponible.
