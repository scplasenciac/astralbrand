import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const WHATSAPP = '51957391382';
const STORE_EMAIL = 'sebastianplasencia313@gmail.com';
const PAYMENT_DETAILS = {
  digital: 'Los datos de Yape / Plin se publicarán pronto. Si deseas realizar tu pedido ahora, contáctanos por WhatsApp.',
  bank: 'Los datos de cuenta bancaria se publicarán pronto. Si deseas realizar tu pedido ahora, contáctanos por WhatsApp.'
};
const items = [
  ['Pink Floyd', 'The Dark Side', '#ad4937', '✳', import.meta.env.BASE_URL+'assets/polopinkfloyd.png'],
  ['Jimi Hendrix', 'Bold as Love', '#652537', '☼', import.meta.env.BASE_URL+'assets/polojimihendrix.png'],
  ['My Chemical Romance', 'Black Parade', '#3c4939', '♜', import.meta.env.BASE_URL+'assets/polomcr.png'],
  ['Arctic Monkeys', 'AM After Hours', '#f1efe9', '☾', import.meta.env.BASE_URL+'assets/poloarcticmonkeys.png'],
  ['Maroon 5', 'Songs About Jane', '#b6a395', '♫', import.meta.env.BASE_URL+'assets/polomaroon5.png'],
  ['The Strokes', 'The New Abnormal', '#705c53', '✳', import.meta.env.BASE_URL+'assets/polothestrokes.png']
];
const collections = [{
  id:'genesis', name:'Genesis', number:'01', eyebrow:'COLECCIÓN 01 · LA PRIMERA ÓRBITA',
  description:'Seis bandas. Seis universos. Una forma nueva de llevarlos.', price:65,
  offer:{quantity:2,total:120,label:'Promo de lanzamiento'}, products:items
}];
function calculateSubtotal(bag) {
  return collections.reduce((sum,collection) => {
    const quantity = bag.filter(item => item.collectionId === collection.id).length;
    if (!quantity) return sum;
    const offer = collection.offer;
    const collectionTotal = offer
      ? Math.floor(quantity/offer.quantity)*offer.total + (quantity%offer.quantity)*collection.price
      : quantity*collection.price;
    return sum + collectionTotal;
  },0);
}

const peruRegions = ['Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco','Huancavelica','Huánuco','Ica','Junín','La Libertad','Lambayeque','Lima','Loreto','Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali'];

function App() {
  const [bag, setBag] = useState([]);
  const [sizes, setSizes] = useState({});
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState('cart');
  const [pay, setPay] = useState('digital');
  const [form, setForm] = useState({name:'', email:'', region:'', district:''});
  const [receipt, setReceipt] = useState(null);
  const [sending, setSending] = useState(false);
  const [order, setOrder] = useState('');
  const [error, setError] = useState('');
  const subtotal = useMemo(() => calculateSubtotal(bag), [bag]);
  const normalize = value => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isFreeDistrict = form.region === 'Lima' && ['san borja','miraflores'].includes(normalize(form.district));
  const shipping = !form.district.trim() || isFreeDistrict ? 0 : 12;
  const total = subtotal + shipping;
  const update = (key, value) => setForm(current => ({...current, [key]: value}));

  function buy(product, collection) {
    setBag(current => [...current, {product, collectionId:collection.id, collectionName:collection.name, price:collection.price, size:sizes[product[1]] || 'M', id:Date.now()+Math.random()}]);
    setStage('cart'); setOpen(true);
  }
  function remove(id) { setBag(current => current.filter(item => item.id !== id)); }
  function closeCart() { setOpen(false); setStage('cart'); setError(''); }
  function validAddress() {
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.region || !form.district.trim()) {
      setError('Completa tu correo, nombre, departamento/región y distrito. Revisa que el correo tenga un formato válido.'); return false;
    }
    setError(''); return true;
  }
  async function submitOrder(event) {
    event.preventDefault(); setError('');
    if (!receipt) { setError('Adjunta tu comprobante para confirmar el pedido.'); return; }
    setSending(true);
    try {
      const data = new FormData();
      data.append('receipt', receipt);
      data.append('order', JSON.stringify({
        customer:form.name, email:form.email, region:form.region, district:form.district,
        deliveryMethod:isFreeDistrict ? 'Entrega gratis en San Borja / Miraflores (coordinar dirección)' : 'Recojo en la agencia Shalom más cercana', agency:{name:'Agencia Shalom más cercana a '+form.district,address:form.region}, payment:pay === 'digital' ? 'Yape / Plin' : 'Depósito en cuenta',
        items:bag.map(item => ({name:item.product[1], artist:item.product[0], collection:item.collectionName, size:item.size, price:item.price})),
        subtotal, shipping, total, estimatedDelivery:shipping===0?'Entrega local coordinada':'2–4 días hábiles'
      }));
      const orderApi = import.meta.env.VITE_ORDER_API_URL;
      if (import.meta.env.PROD && !orderApi) throw new Error('La tienda está publicada, pero el servidor para recibir pedidos aún no está conectado. Escríbenos por WhatsApp para completar tu compra.');
      const response = await fetch(orderApi || '/api/orders', {method:'POST', body:data});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No pudimos enviar tu comprobante. Intenta nuevamente.');
      setOrder(result.orderId); setStage('done');
    } catch (err) { setError(err.message || 'No pudimos enviar tu comprobante. Revisa tu conexión e intenta nuevamente.'); }
    finally { setSending(false); }
  }
  const support = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent('Hola Astral Brand, necesito ayuda con mi pedido.');

  return <>
    <div className="top">COLECCIONES DE MÚSICA · POLOS OVERSIZE · ENVÍOS A TODO EL PERÚ</div>
    <header><a className="logo" href="#"><img className="brand-logo-image" src={import.meta.env.BASE_URL+'assets/logomarca.jpg'} alt="Astral Brand Clothing"/></a><nav><a href="#colecciones">Colecciones</a><a href="#calidad">Nuestro proceso</a><a href="#tallas">Guía de tallas</a></nav><button onClick={()=>{setStage('cart');setOpen(true)}}>♧ Bolsa ({bag.length})</button></header>
    <main>
      <section className="hero"><div><p className="eyebrow">{collections[0].name.toUpperCase()} · LIMA, PERÚ</p><h1>Tu música.<br/><i>Tu universo.</i></h1><p>Clásicos que escuchas, historias que vistes. Diseños oversize inspirados en leyendas de la música, reinterpretados a nuestra manera.</p><a className="btn" href="#colecciones">Descubre las colecciones　→</a>{collections[0].offer&&<div className="launch">✳　 {collections[0].offer.label.toUpperCase()}<br/>　　 {collections[0].offer.quantity} polos por S/ {collections[0].offer.total}</div>}</div><div className="heroart"><div className="orbit"></div><img className="hero-product-photo" src={collections[0].products[0][4]} alt={'Polo '+collections[0].products[0][0]+', colección '+collections[0].name}/><label>{collections[0].name.toUpperCase()}<br/>{collections[0].number} / {String(collections[0].products.length).padStart(2,'0')}</label></div></section>
      <div id="colecciones">{collections.map(collection=><section key={collection.id} id={collection.id} className="collection"><div className="heading"><div><p className="eyebrow">{collection.eyebrow}</p><h2>{collection.name} <i>Collection</i></h2></div><p>{collection.description}</p></div>{collection.offer&&<div className="promo">✳　 <span><b>{collection.offer.label}</b><small>Elige {collection.offer.quantity} diseños de {collection.name} y llévatelos por S/ {collection.offer.total}.</small></span><b className="price">S/ {collection.offer.total}</b></div>}<div className="grid">{collection.products.map((product,i)=><article key={collection.id+'-'+product[1]}><div className="product-art" style={{'--shirt':product[2]}}><small>{collection.name.toUpperCase()} · 0{i+1}</small><img className="product-photo" src={product[4]} alt={'Polo '+product[0]+' — '+product[1]} loading="lazy"/><button className="plus" onClick={()=>buy(product,collection)}>＋</button></div><div className="meta"><span><small>{product[0].toUpperCase()}</small><b>{product[1]}</b></span><strong>S/ {collection.price}</strong></div><p className="sizes">TALLA {['S','M','L'].map(size=><button key={size} className={(sizes[product[1]]||'M')===size?'chosen':''} onClick={()=>setSizes({...sizes,[product[1]]:size})}>{size}</button>)}<button className="add" onClick={()=>buy(product,collection)}>Añadir　↗</button></p></article>)}</div></section>)}</div>
      <section id="calidad" className="craft"><div className="record">✳<small>ASTRAL<br/>SOUND SYSTEM</small></div><div><p className="eyebrow">DETALLE QUE IMPORTA</p><h2>El diseño se ve.<br/><i>La tinta casi no.</i></h2><p>Estampados en serigrafía discharge: la tinta se integra con las fibras del algodón para un acabado suave, ligero y respirable. El gráfico acompaña la tela sin esa capa plástica que se siente al tacto.</p><div className="points">01　Tacto suave, sin relieve<br/>02　Color integrado a la fibra<br/>03　Calce oversize · algodón cómodo</div></div></section>
      <section id="tallas" className="size"><div><p className="eyebrow">ENCUENTRA TU CALCE</p><h2>Tu talla,<br/><i>tu manera.</i></h2><p>Medidas aproximadas de la prenda en plano. Si estás entre dos tallas, elige según qué tan suelto prefieres llevarlo.</p><a href={support} target="_blank" rel="noreferrer">¿Dudas con tu talla? Escríbenos ↗</a></div><div className="table"><div><span>MEDIDAS (CM)</span><b>S</b><b>M</b><b>L</b></div><div><span>Ancho de pecho</span><b>54</b><b>56</b><b>58</b></div><div><span>Largo total</span><b>69.5</b><b>71</b><b>74</b></div><div><span>Largo de manga</span><b>21</b><b>22</b><b>24</b></div><small>Medidas tomadas de lado a lado. Puede variar ± 1–2 cm.</small></div></section>
      <section className="close"><div><p className="eyebrow">TU PRÓXIMA PRENDA FAVORITA</p><h2>Encuentra tu señal. <i>Vístela.</i></h2></div><a className="btn" href="#genesis">Comprar Genesis　↗</a></section>
    </main>
    <footer><a className="logo" href="#"><img className="brand-logo-image" src={import.meta.env.BASE_URL+'assets/logomarca.jpg'} alt="Astral Brand Clothing"/></a><span>ENCUENTRA TU FRECUENCIA.</span><a href="https://www.instagram.com/astralbrandclothing/" target="_blank" rel="noreferrer">Instagram ↗</a><a href={support} target="_blank" rel="noreferrer">Soporte WhatsApp ↗</a><small>© 2026 ASTRAL BRAND · LIMA, PERÚ</small></footer>
    {open&&<div className="shade" onClick={event=>event.target===event.currentTarget&&closeCart()}><aside><button className="closex" onClick={closeCart}>×</button>
      {stage==='cart'&&<><p className="eyebrow">TU SELECCIÓN</p><h2>Bolsa ({bag.length})</h2>{!bag.length?<p>Tu bolsa está en órbita.<br/>Elige un diseño para empezar.</p>:<>{bag.map(item=><div className="item" key={item.id}><span>{item.collectionName} · {item.product[1]} · talla {item.size} · S/ {item.price}</span><button onClick={()=>remove(item.id)}>×</button></div>)}<p className="discount">Los precios y promociones se calculan por colección.</p><div className="total">Subtotal <b>S/ {subtotal}</b></div><button className="btn full" onClick={()=>{setStage('address');setError('')}}>Continuar al pago　→</button></>}{bag.length===0&&<button className="btn" onClick={closeCart}>Ver colección</button>}</>}
      {stage==='address'&&<><p className="eyebrow">PASO 1 DE 3 · ENTREGA</p><h2>¿Dónde lo llevamos?</h2><div className="fields"><label className="email-field">Correo electrónico · para contactarte sobre tu pedido<input type="email" value={form.email} onChange={e=>update('email',e.target.value)} autoComplete="email" placeholder="ejemplo@correo.com" required/></label><label>Nombre completo<input value={form.name} onChange={e=>update('name',e.target.value)} autoComplete="name" placeholder="Tu nombre" required/></label><label>Departamento / región<select value={form.region} onChange={e=>update('region',e.target.value)} required><option value="">Selecciona una región</option>{peruRegions.map(region=><option key={region} value={region}>{region}</option>)}</select></label><label>Distrito<input value={form.district} onChange={e=>update('district',e.target.value)} placeholder="Ej. Miraflores" required/></label><div className="wide delivery-note">{!form.district.trim()?<><b>Ingresa tu distrito para calcular el envío.</b><small>El costo aparecerá aquí según tu ubicación.</small></>:isFreeDistrict?<><b>Envío gratis en {form.district}.</b><small>Coordinaremos contigo la dirección de entrega después de confirmar tu pedido.</small></>:<><b>Envío a agencia Shalom · S/ 12</b><small>Tu pedido se enviará a la agencia Shalom más cercana a <b>{form.district}, {form.region}</b>. Tiempo estimado: 2–4 días hábiles.</small><a href="https://shalom.com.pe/agencias" target="_blank" rel="noreferrer">Consulta las agencias Shalom ↗</a></>}</div></div><div className="shipping">Envío <b>{!form.district.trim()?'S/ 0':shipping===0?'GRATIS':'S/ 12'}</b><small>{!form.district.trim()?'Ingresa tu distrito para calcular el envío':isFreeDistrict?'Entrega coordinada en San Borja o Miraflores':'Recojo en agencia Shalom · plazo estimado de 2–4 días hábiles'}</small></div><div className="total">Total <b>S/ {total}</b></div><button className="btn full" onClick={()=>{if(validAddress())setStage('payment')}}>Continuar　→</button><button className="back" onClick={()=>setStage('cart')}>← Volver a la bolsa</button></>}
      {stage==='payment'&&<><p className="eyebrow">PASO 2 DE 3 · MEDIO DE PAGO</p><h2>Elige cómo pagar</h2><p className="form-intro">Hola {form.name.split(' ')[0]}, tu pedido suma S/ {total}. Realiza el pago y luego adjunta el comprobante.</p><div className="chosen-agency-summary"><b>{isFreeDistrict?'Entrega gratis':'Recojo en Shalom · S/ 12'}</b><span>{form.district}, {form.region}</span><small>{isFreeDistrict?'Coordinaremos la dirección contigo.':'La agencia más cercana se asignará a tu zona. Te confirmaremos la sucursal exacta al procesar el pedido. Plazo estimado: 2–4 días hábiles.'}</small>{!isFreeDistrict&&<a href="https://shalom.com.pe/agencias" target="_blank" rel="noreferrer">Ver agencias ↗</a>}</div><label className={'pay-choice '+(pay==='digital'?'active':'')}><input type="radio" name="pay" checked={pay==='digital'} onChange={()=>setPay('digital')}/><span><b>Yape o Plin</b><small>{PAYMENT_DETAILS.digital}</small></span></label><label className={'pay-choice '+(pay==='bank'?'active':'')}><input type="radio" name="pay" checked={pay==='bank'} onChange={()=>setPay('bank')}/><span><b>Depósito en cuenta</b><small>{PAYMENT_DETAILS.bank}</small></span></label><div className="checkout-total"><span>Polos</span><b>S/ {subtotal}</b><span>Envío</span><b>{!form.district.trim()?'S/ 0':shipping===0?'Gratis':'S/ 12'}</b><strong>Total a pagar</strong><strong>S/ {total}</strong></div><button className="btn full" onClick={()=>setStage('receipt')}>Ya pagué · Adjuntar comprobante　→</button><button className="back" onClick={()=>setStage('address')}>← Cambiar ubicación</button></>}
      {stage==='receipt'&&<><p className="eyebrow">PASO 3 DE 3 · COMPROBANTE</p><h2>Confirma tu pago</h2><p className="form-intro">Adjunta el comprobante de {pay==='digital'?'Yape / Plin':'depósito en cuenta'}. Lo enviaremos a <b>{STORE_EMAIL}</b>.</p><form onSubmit={submitOrder}><label className="upload">{receipt?<><b>✓ {receipt.name}</b><small>Archivo listo para enviar · toca para cambiarlo</small></>:<>＋ Adjuntar comprobante<small>Imagen o PDF · máximo 8 MB</small></>}<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={e=>setReceipt(e.target.files?.[0]||null)} required/></label><div className="checkout-total"><span>Correo del pedido</span><b>{form.email}</b><strong>Total pagado</strong><strong>S/ {total}</strong></div><button className="btn full" disabled={sending||!receipt}>{sending?'Enviando comprobante…':'Enviar comprobante y confirmar　✓'}</button></form><button className="back" onClick={()=>setStage('payment')}>← Volver a medios de pago</button></>}
      {stage==='done'&&<div className="success"><span>✓</span><p className="eyebrow">PEDIDO CONFIRMADO</p><h2>¡Gracias, {form.name.split(' ')[0]}!</h2><p>Recibimos tu pedido <b>{order}</b> y enviamos el comprobante a Astral Brand. Destino de entrega: {isFreeDistrict?'envío gratis en '+form.district:'agencia Shalom más cercana a '+form.district+', '+form.region+' · S/ 12'}. {!isFreeDistrict&&<>Tiempo estimado: <b>2–4 días hábiles</b>. </>}Correo del pedido: <b>{form.email}</b>.</p>{!isFreeDistrict&&<a className="shalom-link" href="https://shalom.com.pe/agencias" target="_blank" rel="noreferrer">Consultar agencias Shalom ↗</a>}<a className="btn full" href={support} target="_blank" rel="noreferrer">¿Necesitas ayuda? WhatsApp　↗</a><button className="back" onClick={closeCart}>Seguir explorando</button></div>}
      {error&&<p className="form-error" role="alert">{error}</p>}
      {stage!=='done'&&<a className="support-link" href={support} target="_blank" rel="noreferrer">¿Problemas con tu compra? Escríbenos por WhatsApp ↗</a>}
    </aside></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);