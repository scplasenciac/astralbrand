# Astral Brand — Genesis

Tienda de React + Vite con checkout y API para recibir comprobantes.

## Iniciar en local

1. Copia `.env.example` como `.env`.
2. Configura las variables SMTP del correo saliente. El destinatario ya está establecido en `sebastianplasencia313@gmail.com`.
3. Los datos de Yape/Plin y de la cuenta bancaria muestran un aviso genérico temporal en el checkout. Cuando estén definidos, actualiza `PAYMENT_DETAILS` en `src/main.jsx`.
4. Ejecuta `npm install` y `npm run dev`.

El pedido se completa cuando la API envía por correo el comprobante adjunto. La confirmación no aparece si el envío de email falla. Las credenciales SMTP deben mantenerse en `.env` y no publicarse.

## Envíos y promoción

En checkout se solicitan provincia y distrito. El envío es gratis solo para San Borja o Miraflores, provincia de Lima; para cualquier otro punto cuesta S/ 12 y el pedido se despacha a la agencia Shalom más cercana a la zona indicada. El enlace al directorio de agencias está disponible en el checkout y en la confirmación. Para los envíos por Shalom, el plazo estimado es de 2–4 días hábiles. Los polos cuestan S/ 65 y la promoción calcula 2 por S/ 120.

## Medios de pago

Yape/Plin y depósito en cuenta están disponibles como opciones del checkout. Por ahora se muestra un texto genérico indicando que los datos de pago se publicarán pronto. Actualiza `PAYMENT_DETAILS` cuando tengas los datos definitivos. La carga acepta PNG, JPG, WEBP o PDF de hasta 8 MB.


## Imágenes

Los seis polos y el logo están en `public/assets` y se muestran en el hero, el catálogo y el encabezado.

## Añadir una colección

El catálogo se genera desde el arreglo `collections` de `src/main.jsx`. Para crear otra, agrega un objeto con su `id`, `name`, `number`, `eyebrow`, `description`, `price` y `products`. Cada producto conserva el formato `[artista, nombre del diseño, color de respaldo, símbolo, ruta de imagen]`. La oferta es opcional; configura `offer` con `quantity`, `total` y `label` si esa colección tendrá una promoción. Así, el descuento se calcula solo entre polos de la misma colección.

## Subir a GitHub

La carpeta del proyecto aún no tiene Git inicializado. Desde PowerShell, situado en esta carpeta, y si el repositorio de GitHub está vacío, ejecuta:

```powershell
git init
git branch -M main
git add .
git commit -m "Create Astral Brand store"
git remote add origin https://github.com/scplasenciac/astralbrand.git
git push -u origin main
```

Para los siguientes cambios:

```powershell
git add .
git commit -m "Describe el cambio"
git push
```

Si `git remote add origin` indica que `origin` ya existe, revisa `git remote -v` y usa `git remote set-url origin https://github.com/scplasenciac/astralbrand.git`. Estos comandos no suben `.env` ni `node_modules` gracias a `.gitignore`. Si GitHub ya tiene archivos o commits, sincroniza esa historia antes del primer push para evitar un rechazo por historias diferentes.

## Publicar en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila Vite y publica `dist` al hacer push a `main`. En GitHub, entra a **Settings → Pages** y selecciona **GitHub Actions** como fuente de publicación. Vite usa `/astralbrand/` como ruta base para el sitio del repositorio.

GitHub Pages publica la interfaz estática; no ejecuta `server.mjs`. Por eso el formulario de comprobantes requiere desplegar también la API Node y definir `VITE_ORDER_API_URL` como variable de entorno de build. Hasta conectar esa API, el catálogo se verá, pero los pedidos mostrarán un mensaje para contactar por WhatsApp.
