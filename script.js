/* ============================================================
   GRANO DORADO · LÓGICA DE LA TIENDA
   ============================================================ */

// ---------- DATOS DE PRODUCTOS ----------
const productos = [
    {
        id: 1,
        nombre: 'Café Americano',
        descripcion: 'Tueste medio, notas a chocolate y caramelo. Origen: Huehuetenango, puntaje SCA > 82.',
        precio: 10.00,
        imagen: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&fit=crop&q=80',
        molienda: true
    },
    {
        id: 2,
        nombre: 'Latte',
        descripcion: 'Espresso doble con leche vaporizada, cremoso y suave. El favorito de la casa.',
        precio: 18.00,
        imagen: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&fit=crop&q=80',
        molienda: false
    },
    {
        id: 3,
        nombre: 'Capuccino',
        descripcion: 'Espresso, leche y espuma densa. Tradición italiana con grano guatemalteco.',
        precio: 20.00,
        imagen: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&fit=crop&q=80',
        molienda: false
    },
    {
        id: 4,
        nombre: 'Snacks Artesanales',
        descripcion: 'Pastel del día o aperitivos salados. Ingredientes frescos y locales.',
        precio: 12.00,
        imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&fit=crop&q=80',
        molienda: false
    }
];

// ---------- ESTADO DEL CARRITO ----------
let carrito = JSON.parse(localStorage.getItem('granoCarrito')) || [];

// ---------- SELECTORES DOM ----------
const productosGrid = document.getElementById('productosGrid');
const carritoBadge = document.getElementById('carritoBadge');
const btnCarrito = document.getElementById('btnCarrito');
const modalCarrito = document.getElementById('modalCarrito');
const btnCerrarCarrito = document.getElementById('btnCerrarCarrito');
const carritoItems = document.getElementById('carritoItems');
const carritoTotal = document.getElementById('carritoTotal');
const btnIrCheckout = document.getElementById('btnIrCheckout');
const modalCheckout = document.getElementById('modalCheckout');
const btnCerrarCheckout = document.getElementById('btnCerrarCheckout');
const formCheckout = document.getElementById('formCheckout');
const checkoutResumen = document.getElementById('checkoutResumen');
const toastContenedor = document.getElementById('toastContenedor');
const btnMenuMovil = document.getElementById('btnMenuMovil');
const navLinks = document.getElementById('navLinks');

// ---------- FUNCIONES DEL CARRITO ----------
function guardarCarrito() {
    localStorage.setItem('granoCarrito', JSON.stringify(carrito));
}

function actualizarBadge() {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    carritoBadge.textContent = total;
    carritoBadge.classList.add('animado');
    setTimeout(() => carritoBadge.classList.remove('animado'), 300);
}

function mostrarToast(mensaje, tipo = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerHTML = `<i class="fa-solid ${tipo === 'exito' ? 'fa-circle-check' : 'fa-cart-shopping'}"></i> ${mensaje}`;
    toastContenedor.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function renderizarCarrito() {
    if (!carritoItems) return;

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio"><i class="fa-solid fa-bag-shopping"></i><br>El carrito está vacío.</p>';
        carritoTotal.textContent = 'Total: Q0.00';
        btnIrCheckout.disabled = true;
        return;
    }

    btnIrCheckout.disabled = false;
    let html = '';
    let total = 0;

    carrito.forEach((item, idx) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <div class="carrito-item">
                <div class="carrito-item-info">
                    <strong>${item.nombre}</strong>
                    <span>${item.molienda ? 'Molienda: ' + item.molienda : 'Bebida preparada'} · Q${item.precio.toFixed(2)} c/u</span>
                </div>
                <div class="carrito-cantidad">
                    <button onclick="modificarCantidad(${idx}, -1)" aria-label="Restar">−</button>
                    <span>${item.cantidad}</span>
                    <button onclick="modificarCantidad(${idx}, 1)" aria-label="Sumar">+</button>
                </div>
                <button class="carrito-eliminar" onclick="eliminarItem(${idx})" aria-label="Eliminar">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>`;
    });

    carritoItems.innerHTML = html;
    carritoTotal.textContent = `Total: Q${total.toFixed(2)}`;
}

function modificarCantidad(idx, delta) {
    carrito[idx].cantidad += delta;
    if (carrito[idx].cantidad <= 0) {
        carrito.splice(idx, 1);
    }
    guardarCarrito();
    actualizarBadge();
    renderizarCarrito();
}

function eliminarItem(idx) {
    carrito.splice(idx, 1);
    guardarCarrito();
    actualizarBadge();
    renderizarCarrito();
    mostrarToast('Producto eliminado del carrito');
}

function agregarAlCarrito(producto, molienda = null) {
    const existente = carrito.find(
        item => item.id === producto.id && item.molienda === molienda
    );
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1,
            molienda: molienda
        });
    }
    guardarCarrito();
    actualizarBadge();
    mostrarToast(`${producto.nombre} agregado al carrito`, 'exito');
}

// ---------- RENDERIZAR PRODUCTOS ----------
function renderizarProductos() {
    if (!productosGrid) return;

    productosGrid.innerHTML = '';
    productos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" class="producto-img" loading="lazy">
            <div class="producto-info">
                <h3 class="producto-nombre">${prod.nombre}</h3>
                <p class="producto-desc">${prod.descripcion}</p>
                <span class="producto-precio">Q${prod.precio.toFixed(2)}</span>
                ${prod.molienda ? `
                <div class="producto-opciones">
                    <select id="molienda-${prod.id}" aria-label="Tipo de molienda">
                        <option value="Grano entero">Grano entero</option>
                        <option value="Molido prensa francesa">Molido prensa francesa</option>
                        <option value="Molido espresso">Molido espresso</option>
                        <option value="Molido V60">Molido V60</option>
                    </select>
                </div>` : ''}
                <button class="btn-agregar" data-id="${prod.id}">
                    <i class="fa-solid fa-plus"></i> Agregar al carrito
                </button>
            </div>`;
        productosGrid.appendChild(card);
    });

    // Event listeners para botones "Agregar"
    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            const producto = productos.find(p => p.id === id);
            let molienda = null;
            if (producto.molienda) {
                const select = document.getElementById(`molienda-${id}`);
                molienda = select ? select.value : null;
            }
            agregarAlCarrito(producto, molienda);

            // Animación breve en el botón
            this.classList.add('agregado');
            this.innerHTML = '<i class="fa-solid fa-check"></i> ¡Agregado!';
            setTimeout(() => {
                this.classList.remove('agregado');
                this.innerHTML = '<i class="fa-solid fa-plus"></i> Agregar al carrito';
            }, 1200);
        });
    });
}

// ---------- MODALES ----------
function abrirCarrito() {
    renderizarCarrito();
    modalCarrito.classList.add('activo');
    document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
    modalCarrito.classList.remove('activo');
    document.body.style.overflow = '';
}

function abrirCheckout() {
    cerrarCarrito();
    modalCheckout.classList.add('activo');
    document.body.style.overflow = 'hidden';
    actualizarResumenCheckout();
}

function cerrarCheckout() {
    modalCheckout.classList.remove('activo');
    document.body.style.overflow = '';
}

function actualizarResumenCheckout() {
    if (!checkoutResumen) return;
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    checkoutResumen.innerHTML = `
        <strong>Resumen del pedido:</strong> ${cantidad} producto(s) · 
        <span style="color: var(--color-dorado-oscuro); font-weight: 700;">Q${total.toFixed(2)}</span>
    `;
}

// ---------- EVENT LISTENERS ----------
btnCarrito.addEventListener('click', abrirCarrito);
btnCerrarCarrito.addEventListener('click', cerrarCarrito);
modalCarrito.addEventListener('click', (e) => {
    if (e.target === modalCarrito) cerrarCarrito();
});
btnIrCheckout.addEventListener('click', () => {
    if (carrito.length > 0) abrirCheckout();
});
btnCerrarCheckout.addEventListener('click', cerrarCheckout);
modalCheckout.addEventListener('click', (e) => {
    if (e.target === modalCheckout) cerrarCheckout();
});

// Cerrar modales con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modalCheckout.classList.contains('activo')) cerrarCheckout();
        else if (modalCarrito.classList.contains('activo')) cerrarCarrito();
    }
});

// Formulario de checkout (siempre acepta)
formCheckout.addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('checkNombre').value.trim();
    if (!nombre) {
        mostrarToast('Por favor, completá al menos tu nombre.', '');
        return;
    }
    // Demo: siempre exitoso
    mostrarToast('¡Pedido confirmado! Gracias por tu compra, ' + nombre + '.', 'exito');
    carrito = [];
    guardarCarrito();
    actualizarBadge();
    cerrarCheckout();
    renderizarCarrito();
    formCheckout.reset();
});

// Formulario de contacto
document.getElementById('formContacto')?.addEventListener('submit', function (e) {
    e.preventDefault();
    mostrarToast('Mensaje enviado correctamente. ¡Gracias!', 'exito');
    this.reset();
});

// Newsletter
document.getElementById('formNewsletter')?.addEventListener('submit', function (e) {
    e.preventDefault();
    mostrarToast('¡Suscripción exitosa! Recibirás nuestras novedades.', 'exito');
    this.reset();
});

// Menú móvil
btnMenuMovil.addEventListener('click', () => {
    navLinks.classList.toggle('activo');
});

// Cerrar menú móvil al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('activo');
    });
});

// ---------- INICIALIZACIÓN ----------
function inicializar() {
    renderizarProductos();
    actualizarBadge();
    renderizarCarrito();
}

inicializar();

console.log('☕ Grano Dorado · Tienda lista. Carrito en localStorage.');