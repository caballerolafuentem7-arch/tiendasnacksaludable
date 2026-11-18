// Base de Datos de Productos
const products = [
    {
        id: 1,
        name: "Queques de Zanahoria",
        category: "Repostería Saludable",
        price: 25.00,
        weight: "250g",
        image: "https://comedera.com/wp-content/uploads/sites/9/2024/06/bizcocho-de-platano-con-zanahoria.jpg?fit=1316,875&crop=0px,68px,1316px,740px",
        desc: "Almendras, nueces, castañas y arándanos deshidratados sin sal."
    },
    {
        id: 2,
        name: "Queques de Remolacha y Chía",
        category: "Repostería Saludable",
        price: 12.50,
        weight: "60g",
        image: "https://img-global.cpcdn.com/recipes/601afc77f91462bc/680x781cq80/torta-de-remolacha-foto-principal.jpg",
        desc: "15g de proteína limpia, endulzado naturalmente con dátiles."
    },
    {
        id: 3,
        name: "Jugos de Papaya",
        category: "Bebidas Naturales",
        price: 15.00,
        weight: "120g",
        image: "https://st1.uvnimg.com/3a/7e/8ca51eb047a482ab8fcd4a84a62d/614954e21bc04de6acb7242a8f5fde49",
        desc: "Jugo natural de papaya fresca, nutritivo y digestivo."
    },
    {
        id: 4,
        name: "Jugo de Naranja",
        category: "Bebidas Naturales",
        price: 18.00,
        weight: "350ml",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVjLqQ8650tLW3UUhbQhciMfzMnGgQHpA2QQrd-K0_gJ-hhf39BqXuYkco&s=10",
        desc: "Bebida refrescante recién exprimida rica en vitamina C."
    },
    {
        id: 5,
        name: "Galleta de Avena y Vainilla",
        category: "Snacks & Galletas",
        price: 30.00,
        weight: "400g",
        image: "https://www.piloncilloyvainilla.com/wp-content/uploads/2023/10/galletas-de-avena-1.jpg",
        desc: "Mezcla crujiente de avena, semillas de chía, girasol y miel pura."
    },
    {
        id: 6,
        name: "Batido Verde y Energético",
        category: "Bebidas Naturales",
        price: 14.00,
        weight: "80g",
        image: "https://www.conasi.eu/blog/wp-content/uploads/2018/04/IMAGEN-DESTACADA-sinergia-verde.jpg",
        desc: "Combinación revitalizante de hojas verdes y frutas naturales."
    }
];

// Estado Global de la App
let cart = [];
let referenceCode = "NUTRI-" + Math.floor(1000 + Math.random() * 9000);

// Inicialización de la App
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
    updateCartUI();
});

// Renderizar catálogo de productos en la interfaz
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const productCount = document.getElementById('productCount');
    if (productCount) {
        productCount.textContent = `${items.length} Productos`;
    }

    grid.innerHTML = items.map(p => `
        <div class="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
                <div class="relative overflow-hidden rounded-2xl mb-4 h-48 bg-slate-100">
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://placehold.co/400x400/22c55e/ffffff?text=NutriSnack'">
                    <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-200">${p.category}</span>
                    <span class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">${p.weight}</span>
                </div>
                <h3 class="font-bold text-slate-800 text-base leading-snug group-hover:text-brand-600 transition-colors">${p.name}</h3>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">${p.desc}</p>
            </div>
            
            <div class="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
                <div>
                    <span class="text-xs text-slate-400 block font-medium">Precio</span>
                    <span class="text-lg font-extrabold text-slate-900">Bs. ${p.price.toFixed(2)}</span>
                </div>
                <button onclick="addToCart(${p.id})" class="bg-brand-600 hover:bg-brand-700 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-brand-600/30 transition-all hover:scale-105 active:scale-95">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Configuración de Eventos de la Interfaz
function setupEventListeners() {
    // Controles del Carrito Lateral
    const cartDrawer = document.getElementById('cartDrawer');
    const cartContent = document.getElementById('cartContent');
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartBackdrop = document.getElementById('cartBackdrop');

    const toggleCart = (show) => {
        if (!cartDrawer || !cartContent) return;
        if (show) {
            cartDrawer.classList.remove('invisible', 'pointer-events-none');
            cartDrawer.classList.add('opacity-100');
            cartContent.classList.remove('translate-x-full');
        } else {
            cartDrawer.classList.add('opacity-0');
            cartContent.classList.add('translate-x-full');
            setTimeout(() => {
                cartDrawer.classList.add('invisible', 'pointer-events-none');
            }, 300);
        }
    };

    if (openCartBtn) openCartBtn.addEventListener('click', () => toggleCart(true));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
    if (cartBackdrop) cartBackdrop.addEventListener('click', () => toggleCart(false));

    // Controles del Modal de Pago QR
    const checkoutModal = document.getElementById('checkoutModal');
    const proceedToPayBtn = document.getElementById('proceedToPayBtn');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    const checkoutBackdrop = document.getElementById('checkoutBackdrop');

    const toggleCheckout = (show) => {
        if (!checkoutModal) return;
        if (show) {
            toggleCart(false);
            checkoutModal.classList.remove('invisible');
            checkoutModal.classList.add('opacity-100');
            updateCheckoutModalUI();
        } else {
            checkoutModal.classList.remove('opacity-100');
            setTimeout(() => {
                checkoutModal.classList.add('invisible');
            }, 300);
        }
    };

    if (proceedToPayBtn) proceedToPayBtn.addEventListener('click', () => toggleCheckout(true));
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => toggleCheckout(false));
    if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', () => toggleCheckout(false));

    // Botón directo para enviar pedido por WhatsApp
    const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
    if (sendWhatsappBtn) sendWhatsappBtn.addEventListener('click', sendOrderToWhatsApp);
}

// Agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    showToast(`Añadido: ${product.name}`);
}

// Modificar cantidad en el carrito
function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

// Actualizar Interfaz del Carrito y Sincronizar Totales
function updateCartUI() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const totalPrice = document.getElementById('totalPrice');
    const proceedToPayBtn = document.getElementById('proceedToPayBtn');

    if (!cartItemsList) return;

    const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

    if (cartCountBadge) cartCountBadge.textContent = totalItems;
    if (totalPrice) totalPrice.textContent = `Bs. ${subtotal.toFixed(2)}`;
    if (proceedToPayBtn) proceedToPayBtn.disabled = cart.length === 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <i class="fa-solid fa-basket-shopping text-5xl mb-3 text-slate-300"></i>
                <p class="font-bold text-slate-600">Tu carrito está vacío</p>
                <p class="text-xs text-slate-400 mt-1">Explora nuestros productos y agrega tus snacks favoritos.</p>
            </div>
        `;
        return;
    }

    cartItemsList.innerHTML = cart.map(item => `
        <div class="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-slate-100">
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-800 text-xs truncate">${item.name}</h4>
                <p class="text-xs text-brand-600 font-extrabold mt-0.5">Bs. ${(item.price * item.quantity).toFixed(2)}</p>
                <div class="flex items-center gap-2 mt-2">
                    <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">-</button>
                    <span class="text-xs font-semibold text-slate-800">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">+</button>
                </div>
            </div>
            <button onclick="updateQuantity(${item.id}, -${item.quantity})" class="text-slate-300 hover:text-red-500 p-2 transition-colors">
                <i class="fa-solid fa-trash-can text-sm"></i>
            </button>
        </div>
    `).join('');
}

// Sincronizar el total a pagar en el modal del QR
function updateCheckoutModalUI() {
    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const checkoutTotal = document.getElementById('checkoutTotal');
    if (checkoutTotal) {
        checkoutTotal.textContent = `Bs. ${subtotal.toFixed(2)}`;
    }
    // Generar nuevo código de referencia por pedido
    referenceCode = "NUTRI-" + Math.floor(1000 + Math.random() * 9000);
}

// Envío directo del pedido a WhatsApp
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        showToast("Tu carrito está vacío");
        return;
    }

    const nameInput = document.getElementById('custName');
    const addressInput = document.getElementById('custAddress');
    const name = nameInput?.value.trim();
    const address = addressInput?.value.trim();

    if (!name) {
        showToast("Por favor, ingresa tu nombre completo");
        nameInput?.focus();
        return;
    }
    if (!address) {
        showToast("Por favor, ingresa tu dirección de entrega");
        addressInput?.focus();
        return;
    }

    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2);
    const itemListText = cart.map(i => `• ${i.name} (x${i.quantity}) - Bs. ${(i.price * i.quantity).toFixed(2)}`).join('\n');

    let msg = `*NUEVO PEDIDO - NUTRISNACKS* 🌿\n`;
    msg += `----------------------------------\n`;
    msg += `*Código de Pedido:* ${referenceCode}\n`;
    msg += `*Cliente:* ${name}\n`;
    msg += `*Dirección:* ${address}\n`;
    msg += `*Beneficiario QR:* Deymar Cespedes Huerta\n\n`;
    msg += `*DETALLE DEL PEDIDO:*\n${itemListText}\n\n`;
    msg += `*TOTAL A PAGAR:* Bs. ${subtotal}\n`;
    msg += `----------------------------------\n`;
    msg += `_¡Hola! Envío mi pedido y adjunto mi comprobante de pago QR._`;

    // Número sin espacios ni símbolos para compatibilidad universal con WhatsApp
    const phone = "59162392294";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
}

// Notificaciones flotantes tipo Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}
