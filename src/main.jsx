import React, { useEffect, useMemo, useState } from 'react';
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
  description:'Seis bandas. Seis universos. Una forma nueva de llevarlos.', price:60,
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

const peruRegions = ['Amazonas','Ancash','Apurimac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco','Huancavelica','Huanuco','Ica','Junin','La Libertad','Lambayeque','Lima','Loreto','Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martin','Tacna','Tumbes','Ucayali'];

// Publicly listed Shalom locations. ASCII names avoid encoding issues in the selectors.
const shalomCoverage = {
  'Amazonas': {'Chachapoyas':['Chachapoyas']}, 'Ancash': {'Huaraz':['Huaraz'],'Santa':['Chimbote']},
  'Apurimac': {'Abancay':['Abancay']}, 'Arequipa': {'Arequipa':['Arequipa']},
  'Ayacucho': {'Huamanga':['Ayacucho']}, 'Cajamarca': {'Cajamarca':['Cajamarca','Banos del Inca']},
  'Callao': {'Callao':['Callao','La Perla','Ventanilla']}, 'Cusco': {'Cusco':['Cusco'],'La Convencion':['Santa Ana']},
  'Huancavelica': {'Huancavelica':['Huancavelica']}, 'Huanuco': {'Huanuco':['Huanuco'],'Leoncio Prado':['Tingo Maria']},
  'Ica': {'Ica':['Ica'],'Chincha':['Chincha Alta'],'Pisco':['Pisco'],'Nazca':['Nasca']},
  'Junin': {'Huancayo':['Huancayo','El Tambo','Chilca'],'Tarma':['Tarma'],'Satipo':['Satipo']},
  'La Libertad': {'Trujillo':['Trujillo','Moche','Huanchaco','Victor Larco Herrera']},
  'Lambayeque': {'Chiclayo':['Chiclayo','Monsefu']},
  'Lima': {
    'Lima':['Ancon','Ate','Barranco','Brena','Carabayllo','Cieneguilla','Comas','El Agustino','Jesus Maria','La Molina','La Victoria','Lince','Los Olivos','Lurigancho-Chosica','Lurin','Magdalena del Mar','Miraflores','Pachacamac','Pueblo Libre','Puente Piedra','Punta Hermosa','Rimac','San Borja','San Isidro','San Juan de Lurigancho','San Juan de Miraflores','San Martin de Porres','San Miguel','Santa Anita','Santiago de Surco','Surquillo','Villa El Salvador','Villa Maria del Triunfo'],
    'Barranca':['Barranca','Paramonga','Supe'], 'Canete':['San Vicente de Canete','Nuevo Imperial'],
    'Huaral':['Huaral','Chancay'], 'Huaura':['Huacho','Huaura','Sayan'], 'Huarochiri':['San Antonio']
  },
  'Loreto': {'Maynas':['Iquitos']}, 'Madre de Dios': {'Tambopata':['Puerto Maldonado']},
  'Moquegua': {'Mariscal Nieto':['Moquegua']}, 'Pasco': {'Pasco':['Cerro de Pasco']},
  'Piura': {'Piura':['Piura','Castilla','Catacaos','Veintiseis de Octubre'],'Sullana':['Sullana'],'Talara':['Parinas','Mancora']},
  'Puno': {'Puno':['Puno'],'San Roman':['Juliaca']}, 'San Martin': {'San Martin':['Tarapoto'],'Moyobamba':['Moyobamba']},
  'Tacna': {'Tacna':['Tacna']}, 'Tumbes': {'Tumbes':['Tumbes']}, 'Ucayali': {'Coronel Portillo':['Calleria','Yarinacocha']}
};

const heroPhotos = [
  {src:import.meta.env.BASE_URL+'assets/campaign-black-parade.png', alt:'Look Astral Brand con polo My Chemical Romance'},
  {src:import.meta.env.BASE_URL+'assets/campaign-jimi.png', alt:'Look Astral Brand con polo Jimi Hendrix'},
  {src:import.meta.env.BASE_URL+'assets/campaign-strokes.jpg', alt:'Look Astral Brand con polo The Strokes'}
];
const craftPhotos = [
  {src:import.meta.env.BASE_URL+'assets/talla-s.png', alt:'Guia de talla S: polo Jimi Hendrix, largo 69.5 cm y ancho 54 cm'},
  {src:import.meta.env.BASE_URL+'assets/talla-m.png', alt:'Guia de talla M: polo My Chemical Romance, largo 71 cm y ancho 56 cm'},
  {src:import.meta.env.BASE_URL+'assets/talla-l.png', alt:'Guia de talla L: polo The Strokes, largo 74 cm y ancho 56 cm'}
];

function App() {
  const [bag, setBag] = useState([]);
  const [sizes, setSizes] = useState({});
  const [activeProduct, setActiveProduct] = useState(null);
  const [heroProductIndex, setHeroProductIndex] = useState(0);
  const [craftPhotoIndex, setCraftPhotoIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState('cart');
  const [pay, setPay] = useState('digital');
  const [form, setForm] = useState({name:'', email:'', region:'', province:'', district:''});
  const [receipt, setReceipt] = useState(null);
  const [sending, setSending] = useState(false);
  const [order, setOrder] = useState('');
  const [error, setError] = useState('');
  const subtotal = useMemo(() => calculateSubtotal(bag), [bag]);
  const heroPhoto = heroPhotos[heroProductIndex];
  useEffect(() => {
    const timer = setInterval(() => setHeroProductIndex(index => (index + 1) % heroPhotos.length), 5000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => setCraftPhotoIndex(index => (index + 1) % craftPhotos.length), 5000);
    return () => clearInterval(timer);
  }, []);
  const normalize = value => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const provinces = Object.keys(shalomCoverage[form.region] || {});
  const districts = shalomCoverage[form.region]?.[form.province] || [];
  const freeDeliveryDistricts = ['san borja','miraflores','barranco','surquillo','san isidro'];
  const isFreeDistrict = form.region === 'Lima' && form.province === 'Lima' && freeDeliveryDistricts.includes(normalize(form.district));
  const isPromoFreeShipping = bag.length >= 2;
  const shipping = !form.district.trim() || isFreeDistrict || isPromoFreeShipping ? 0 : 10;
  const total = subtotal + shipping;
  const update = (key, value) => setForm(current => key === 'region'
    ? {...current, region:value, province:'', district:''}
    : key === 'province' ? {...current, province:value, district:''} : {...current, [key]:value});

  function buy(product, collection) {
    setBag(current => [...current, {product, collectionId:collection.id, collectionName:collection.name, price:collection.price, size:sizes[product[1]], id:Date.now()+Math.random()}]);
    setStage('cart'); setOpen(true);
  }
  function buyNow(product, collection) {
    setBag(current => [...current, {product, collectionId:collection.id, collectionName:collection.name, price:collection.price, size:sizes[product[1]] || 'M', id:Date.now()+Math.random()}]);
    setStage('address'); setError(''); setOpen(true);
  }
  function remove(id) { setBag(current => current.filter(item => item.id !== id)); }
  function closeCart() { setOpen(false); setStage('cart'); setError(''); }
  function validAddress() {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim());
    if (!form.name.trim() || !validEmail || !form.region || !form.province || !form.district) {
      setError('Ingresa un correo válido (Gmail, Hotmail, Outlook u otro) y completa tu nombre, región y distrito.'); return false;
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
        customer:form.name, email:form.email, region:form.region, province:form.province, district:form.district,
        deliveryMethod:isFreeDistrict ? 'Entrega gratis coordinada a domicilio' : 'Envío a la agencia Shalom más cercana', agency:isFreeDistrict ? null : {name:'Agencia Shalom más cercana a '+form.district,address:form.district+', '+form.province+', '+form.region}, payment:pay === 'digital' ? 'Yape / Plin' : 'Depósito en cuenta',
        items:bag.map(item => ({name:item.product[1], artist:item.product[0], collection:item.collectionName, promoEligible:collections.find(collection => collection.id === item.collectionId)?.offer?.quantity === 2 && collections.find(collection => collection.id === item.collectionId)?.offer?.total === 120, size:item.size, price:item.price})),
        subtotal, shipping, total, freeShippingPromo:isPromoFreeShipping && !isFreeDistrict, estimatedDelivery:isFreeDistrict?'Entrega local coordinada':'2–4 días hábiles'
      }));
      const orderApi = import.meta.env.VITE_ORDER_API_URL;
      if (import.meta.env.PROD && !orderApi) throw new Error('La tienda está publicada, pero el servidor para recibir pedidos aún no está conectado. Escríbenos por WhatsApp para completar tu compra.');
      const response = await fetch(orderApi || '/api/orders', {method:'POST', body:data, signal:AbortSignal.timeout(120000)});
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
      <section className="hero"><div><p className="eyebrow">{collections[0].name.toUpperCase()} · LIMA, PERÚ</p><h1>Tu música.<br/><i>Tu universo.</i></h1><p>Clásicos que escuchas, historias que vistes. Diseños oversize inspirados en leyendas de la música, reinterpretados a nuestra manera.</p><a className="btn" href="#colecciones">Descubre las colecciones　→</a>{collections[0].offer&&<div className="launch"><span>✳　{collections[0].offer.label.toUpperCase()}</span><p className="launch-message">Envío gratis desde 2 polos, con entrega en la agencia Shalom más cercana. Entrega gratis coordinada en San Borja, Miraflores, San Isidro, Barranco y Surquillo.</p></div>}</div><div className="heroart"><div className="orbit"></div><img key={heroPhoto.src} className="hero-product-photo hero-lifestyle-photo" src={heroPhoto.src} alt={heroPhoto.alt}/><label>ASTRAL BRAND<br/>{String(heroProductIndex+1).padStart(2,'0')} / {String(heroPhotos.length).padStart(2,'0')}</label></div></section>
      <div id="colecciones">{collections.map(collection=><section key={collection.id} id={collection.id} className="collection"><div className="heading"><div><p className="eyebrow">{collection.eyebrow}</p><h2>{collection.name} <i>Collection</i></h2></div><p>{collection.description}</p></div><div className="grid">{collection.products.map((product,i)=><article key={collection.id+'-'+product[1]} className={activeProduct===collection.id+'-'+product[1]?'actions-visible':''}><div className="product-art" style={{'--shirt':product[2]}}><small>{collection.name.toUpperCase()} · 0{i+1}</small><img className="product-photo" src={product[4]} alt={'Polo '+product[0]+' — '+product[1]} loading="lazy"/><button type="button" className="image-trigger" aria-label={'Mostrar tallas y opciones de compra para '+product[1]} onClick={()=>setActiveProduct(activeProduct===collection.id+'-'+product[1]?null:collection.id+'-'+product[1])}/><div className="product-actions"><div className="size-picker"><span>ELIGE TU TALLA</span>{['S','M','L'].map(size=><button type="button" key={size} className={sizes[product[1]]===size?'chosen':''} aria-pressed={sizes[product[1]]===size} onClick={()=>setSizes(current=>({...current,[product[1]]:size}))}>{size}</button>)}</div><button className="buy-now" disabled={!sizes[product[1]]} onClick={()=>buyNow(product,collection)}>Lo quiero　↗</button><button className="add-to-cart" disabled={!sizes[product[1]]} onClick={()=>buy(product,collection)}>Agregar al carrito</button></div></div><div className="meta"><span><small>{product[0].toUpperCase()}</small><b>{product[1]}</b></span><strong>S/ {collection.price}</strong></div></article>)}</div></section>)}</div>
      <section id="calidad" className="craft"><div className="record photo-record" aria-label="Guia de tallas"><img key={craftPhotoIndex} className="record-photo" src={craftPhotos[craftPhotoIndex].src} alt={craftPhotos[craftPhotoIndex].alt}/><div className="record-shade"></div><div className="record-caption"><span>GUIA</span><small>DE TALLAS</small></div><div className="record-indicator">{craftPhotos.map((photo,index)=><button type="button" key={photo.src} className={craftPhotoIndex===index?'active':''} aria-label={'Mostrar foto '+(index+1)} aria-pressed={craftPhotoIndex===index} onClick={()=>setCraftPhotoIndex(index)}></button>)}</div></div><div><p className="eyebrow">DETALLE QUE IMPORTA</p><h2>El diseño se ve.<br/><i>La tinta casi no.</i></h2><p>Estampados en serigrafía discharge: la tinta se integra con las fibras del algodón para un acabado suave, ligero y respirable. El gráfico acompaña la tela sin esa capa plástica que se siente al tacto.</p><div className="points">01　Tacto suave, sin relieve<br/>02　Color integrado a la fibra<br/>03　Calce oversize · algodón cómodo</div></div></section>
      <section id="tallas" className="size"><div><p className="eyebrow">ENCUENTRA TU CALCE</p><h2>Tu talla,<br/><i>tu manera.</i></h2><p>Medidas aproximadas de la prenda en plano. Si estás entre dos tallas, elige según qué tan suelto prefieres llevarlo.</p><a href={support} target="_blank" rel="noreferrer">¿Dudas con tu talla? Escríbenos ↗</a></div><div className="table"><div><span>MEDIDAS (CM)</span><b>S</b><b>M</b><b>L</b></div><div><span>Ancho de pecho</span><b>54</b><b>56</b><b>58</b></div><div><span>Largo total</span><b>69.5</b><b>71</b><b>74</b></div><div><span>Largo de manga</span><b>21</b><b>22</b><b>24</b></div><small>Medidas tomadas de lado a lado. Puede variar ± 1–2 cm.</small></div></section>
      <section className="close"><div><p className="eyebrow">TU PRÓXIMA PRENDA FAVORITA</p><h2>Encuentra tu señal. <i>Vístela.</i></h2></div><a className="btn" href="#genesis">Comprar Genesis　↗</a></section>
    </main>
    <footer><a className="logo" href="#"><img className="brand-logo-image" src={import.meta.env.BASE_URL+'assets/logomarca.jpg'} alt="Astral Brand Clothing"/></a><span>ENCUENTRA TU FRECUENCIA.</span><a href="https://www.instagram.com/astralbrandclothing/" target="_blank" rel="noreferrer">Instagram ↗</a><a href={support} target="_blank" rel="noreferrer">Soporte WhatsApp ↗</a><small>© 2026 ASTRAL BRAND · LIMA, PERÚ</small></footer>
    {open&&<div className="shade" onClick={event=>event.target===event.currentTarget&&closeCart()}><aside><button className="closex" onClick={closeCart}>×</button>
      {stage==='cart'&&<><p className="eyebrow">TU SELECCIÓN</p><h2>Bolsa ({bag.length})</h2>{!bag.length?<p>Tu bolsa está en órbita.<br/>Elige un diseño para empezar.</p>:<>{bag.map(item=><div className="item" key={item.id}><img className="item-thumb" src={item.product[4]} alt={item.product[0]+' - '+item.product[1]}/><div className="item-copy"><b>{item.product[0]}</b><span>{item.product[1]} · talla {item.size} · S/ {item.price}</span></div><button aria-label={'Quitar '+item.product[0]+' de la bolsa'} onClick={()=>remove(item.id)}>×</button></div>)}<p className="discount">Los precios y promociones se calculan por colección.</p><div className="total">Subtotal <b>S/ {subtotal}</b></div><button className="btn full" onClick={()=>{setStage('address');setError('')}}>Continuar al pago　→</button></>}{bag.length===0&&<button className="btn" onClick={closeCart}>Ver colección</button>}</>}
      {stage==='address'&&<><p className="eyebrow">PASO 1 DE 3 · ENTREGA</p><h2>¿Dónde lo llevamos?</h2><div className="fields"><label className="email-field">Correo electrónico · para contactarte sobre tu pedido<input type="email" value={form.email} onChange={e=>update('email',e.target.value)} autoComplete="email" placeholder="ejemplo@correo.com" required/></label><label>Nombre completo<input value={form.name} onChange={e=>update('name',e.target.value)} autoComplete="name" placeholder="Tu nombre" required/></label><label>Departamento / región<select value={form.region} onChange={e=>update('region',e.target.value)} required><option value="">Selecciona una región</option>{peruRegions.map(region=><option key={region} value={region}>{region}</option>)}</select></label><label>Provincia<select value={form.province} onChange={e=>update('province',e.target.value)} required disabled={!form.region}><option value="">{form.region?'Selecciona una provincia':'Primero elige una región'}</option>{provinces.map(province=><option key={province} value={province}>{province}</option>)}</select></label><label>Distrito<select value={form.district} onChange={e=>update('district',e.target.value)} required disabled={!form.province}><option value="">{form.province?'Selecciona un distrito':'Primero elige una provincia'}</option>{districts.map(district=><option key={district} value={district}>{district}</option>)}</select></label><div className="wide delivery-note"><small>El listado es referencial y se basa en directorios públicos; confirmaremos la agencia exacta y la cobertura antes del despacho.</small>{!form.district.trim()?<><b>Ingresa tu distrito para calcular el envío.</b><small>El costo aparecerá aquí según tu ubicación.</small></>:isFreeDistrict?<><b>Envío gratis en {form.district}.</b><small>La entrega se coordina directamente contigo; no se envía por Shalom.</small></>:isPromoFreeShipping?<><b>Envío Shalom gratis desde 2 polos.</b><small>Tu pedido se enviará a la agencia Shalom más cercana a <b>{form.district}, {form.province}, {form.region}</b>. Tiempo estimado: 2–4 días hábiles. Confirmaremos la agencia exacta antes del despacho.</small><a href="https://shalom.com.pe/agencias" target="_blank" rel="noreferrer">Consulta las agencias Shalom ↗</a></>:<><b>Envío por agencia Shalom · S/ 10</b><small>Tu pedido se enviará a la agencia Shalom más cercana a <b>{form.district}, {form.province}, {form.region}</b>. Tiempo estimado: 2–4 días hábiles. Confirmaremos la agencia exacta antes del despacho.</small><a href="https://shalom.com.pe/agencias" target="_blank" rel="noreferrer">Consulta las agencias Shalom ↗</a></>}</div></div><div className="shipping">Envío <b>{!form.district.trim()?'S/ 0':shipping===0?'GRATIS':'S/ 10'}</b><small>{!form.district.trim()?'Ingresa tu distrito para calcular el envío':isFreeDistrict?'Entrega coordinada gratis en San Borja, Miraflores, San Isidro, Barranco y Surquillo':isPromoFreeShipping?'Envío gratis por promoción a agencia Shalom':'Recojo en agencia Shalom · plazo estimado de 2–4 días hábiles'}</small></div><div className="total">Total <b>S/ {total}</b></div><button className="btn full" onClick={()=>{if(validAddress())setStage('payment')}}>Continuar　→</button><button className="back" onClick={()=>setStage('cart')}>← Volver a la bolsa</button></>}
      {stage==='payment'&&<><p className="eyebrow">PASO 2 DE 3 · MEDIO DE PAGO</p><h2>Elige cómo pagar</h2><p className="form-intro">Hola {form.name.split(' ')[0]}, tu pedido suma S/ {total}. Realiza el pago y luego adjunta el comprobante.</p><div className="chosen-agency-summary"><b>{isFreeDistrict?'Entrega gratis coordinada':isPromoFreeShipping?'Envío gratis por promo · agencia Shalom':'Recojo en Shalom · S/ 10'}</b><span>{form.district}, {form.province}, {form.region}</span><small>{isFreeDistrict?'Coordinaremos contigo la entrega; no se usa Shalom.':isPromoFreeShipping?'Por comprar 2 o más polos, el envío a Shalom es gratis. Plazo estimado: 2–4 días hábiles.':'La agencia más cercana se asignará a tu zona. Te confirmaremos la sucursal exacta al procesar el pedido. Plazo estimado: 2–4 días hábiles.'}</small>{!isFreeDistrict&&<a href="https://shalom.com.pe/agencias" target="_blank" rel="noreferrer">Ver agencias ↗</a>}</div><label className={'pay-choice '+(pay==='digital'?'active':'')}><input type="radio" name="pay" checked={pay==='digital'} onChange={()=>setPay('digital')}/><span><b>Yape o Plin</b><small>{PAYMENT_DETAILS.digital}</small></span></label><label className={'pay-choice '+(pay==='bank'?'active':'')}><input type="radio" name="pay" checked={pay==='bank'} onChange={()=>setPay('bank')}/><span><b>Depósito en cuenta</b><small>{PAYMENT_DETAILS.bank}</small></span></label><div className="checkout-total"><span>Polos</span><b>S/ {subtotal}</b><span>Envío</span><b>{!form.district.trim()?'S/ 0':shipping===0?'Gratis':'S/ 10'}</b><strong>Total a pagar</strong><strong>S/ {total}</strong></div><button className="btn full" onClick={()=>setStage('receipt')}>Ya pagué · Adjuntar comprobante　→</button><button className="back" onClick={()=>setStage('address')}>← Cambiar ubicación</button></>}
      {stage==='receipt'&&<><p className="eyebrow">PASO 3 DE 3 · COMPROBANTE</p><h2>Confirma tu pago</h2><p className="form-intro">Adjunta el comprobante de {pay==='digital'?'Yape / Plin':'depósito en cuenta'}. Lo enviaremos a <b>{STORE_EMAIL}</b>.</p><form onSubmit={submitOrder}><label className="upload">{receipt?<><b>✓ {receipt.name}</b><small>Archivo listo para enviar · toca para cambiarlo</small></>:<>＋ Adjuntar comprobante<small>Imagen o PDF · máximo 8 MB</small></>}<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={e=>setReceipt(e.target.files?.[0]||null)} required/></label><div className="checkout-total"><span>Correo del pedido</span><b>{form.email}</b><strong>Total pagado</strong><strong>S/ {total}</strong></div><button className="btn full" disabled={sending||!receipt}>{sending?'Enviando comprobante…':'Enviar comprobante y confirmar　✓'}</button></form><button className="back" onClick={()=>setStage('payment')}>← Volver a medios de pago</button></>}
      {stage==='done'&&<div className="success"><span>✓</span><p className="eyebrow">PEDIDO CONFIRMADO</p><h2>¡Gracias, {form.name.split(' ')[0]}!</h2><p><b>Tu compra fue realizada con éxito.</b> Recibimos tu comprobante y estamos verificando el pago. Código de compra: <b>{order}</b>. Enviamos la confirmación a <b>{form.email}</b>. Destino de entrega: {isFreeDistrict?'entrega gratis coordinada en '+form.district:isPromoFreeShipping?'agencia Shalom más cercana a '+form.district+', '+form.province+', '+form.region+' · envío gratis por promoción':'agencia Shalom más cercana a '+form.district+', '+form.province+', '+form.region+' · S/ 10'}. {!isFreeDistrict&&<>Tiempo estimado: <b>2–4 días hábiles</b>. </>}Cualquier duda, comunícate con nosotros por <a href={support} target="_blank" rel="noreferrer">WhatsApp al +51 957 391 382</a>.</p>{!isFreeDistrict&&<a className="shalom-link" href="https://shalom.com.pe/agencias" target="_blank" rel="noreferrer">Consultar agencias Shalom ↗</a>}<a className="btn full" href={support} target="_blank" rel="noreferrer">¿Necesitas ayuda? WhatsApp　↗</a><button className="back" onClick={closeCart}>Seguir explorando</button></div>}
      {error&&<p className="form-error" role="alert">{error}</p>}
      {stage!=='done'&&<a className="support-link" href={support} target="_blank" rel="noreferrer">¿Problemas con tu compra? Escríbenos por WhatsApp ↗</a>}
    </aside></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
