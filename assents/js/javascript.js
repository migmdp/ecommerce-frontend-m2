// Arreglo de objetos con los productos (Requisito: cards generadas desde un arreglo JS) 
const productos = [
    {
        id: 1,
        nombre: "Laptop Ultraligera",
        precio: 1200.00,
        descripcion: "Perfecta para trabajar y estudiar, con 16GB de RAM y SSD de 512GB.",
        //imagen: "https://via.placeholder.com/300x200?text=Laptop"
        imagen: "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MzM3NTg5fGltYWdlL3BuZ3xoM2MvaDExLzE0MTkxNTE3NDAxMTE4LnBuZ3w4OTg2YTg5YzQ0ZmFiZDYzOTdjZTkzNDJjNDY3MTJlODM4YTQ2ODdlMGVmZTFlYjBiODRjYWFmY2JjOTBkODNj/lenovo-laptop-ideapad-3i-15in-hero.png"
    },
    {
        id: 2,
        nombre: "Smartwatch Deportivo",
        precio: 250.00,
        descripcion: "Monitorea tu salud y recibe notificaciones en tu muñeca.",
        imagen: "https://www.hites.com/dw/image/v2/BDPN_PRD/on/demandware.static/-/Sites-mastercatalog_HITES/default/dw7c1fec85/images/original/mkp/1030300046300/10303000463001_1.jpg?sw=1000&sh=1000"
    },
    {
        id: 3,
        nombre: "Auriculares Inalámbricos",
        precio: 150.00,
        descripcion: "Audio de alta fidelidad con cancelación de ruido activa.",
        imagen: "https://media.falabella.com/falabellaCL/142398026_01/w=800,h=800,fit=pad"
    },
    // Agrega más productos aquí
];

// Variable para simular el carrito de compras (se sugiere usar localStorage) 
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Elementos del DOM [cite: 34]
const contenedorProductos = document.querySelector('#productos');
const contadorCarrito = document.querySelector('#contador-carrito');

// --- Funciones del DOM y Renderizado ---

// Función que renderiza todos los productos en el HTML
function renderizarProductos() {
    productos.forEach(producto => {
        // Estructura de columna para responsividad (Bootstrap Grid) [cite: 32]
        // col-12 en móvil, col-md-6 en tablet, col-lg-4 en desktop.
        const col = document.createElement('div');
        col.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4');
        
        // Card de Bootstrap [cite: 32]
        col.innerHTML = `
            <div class="card shadow-sm h-100" data-id="${producto.id}">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion.substring(0, 50)}...</p>
                    <p class="card-text fw-bold mt-auto">$${producto.precio.toFixed(2)}</p>
                    <div class="d-flex justify-content-between">
                        <a href="detalle.html?id=${producto.id}" class="btn btn-outline-secondary btn-sm">Ver más</a>
                        <button class="btn btn-primary btn-sm agregar-carrito" data-id="${producto.id}">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(col);
    });
}

// Función que actualiza el contador del carrito en la Navbar 
function actualizarContadorCarrito() {
    contadorCarrito.textContent = carrito.length;
    // Guardar en localStorage para que persista (opcional, pero recomendado) 
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// --- Manejo de Eventos (Eventos y estados simples) --- 

function agregarAlCarrito(e) {
    // Verificar que el clic provenga del botón correcto
    if (e.target.classList.contains('agregar-carrito')) {
        const idProducto = parseInt(e.target.dataset.id);
        
        // Buscar el producto en el arreglo original
        const productoAAgregar = productos.find(p => p.id === idProducto);

        if (productoAAgregar) {
            carrito.push(productoAAgregar);
            actualizarContadorCarrito();
            console.log(`Producto ${idProducto} agregado. Total: ${carrito.length}`);
            // Aquí podrías agregar un mensaje de éxito con un Toast de Bootstrap.
        }
    }
}

// Event Listeners
contenedorProductos.addEventListener('click', agregarAlCarrito);

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    actualizarContadorCarrito();
});

// --- Lógica específica para el Carrito ---

// Elementos del DOM para el carrito
const itemsCarrito = document.querySelector('#items-carrito');
const totalCarrito = document.querySelector('#total-carrito');
const botonComprar = document.querySelector('#boton-comprar');
const botonVaciar = document.querySelector('#boton-vaciar');

// Función para renderizar el listado del carrito
function renderizarCarrito() {
    if (!itemsCarrito) return; // Salir si no estamos en carrito.html

    // Vaciar el listado antes de renderizar (evita duplicados)
    itemsCarrito.innerHTML = '';
    
    // Agrupar productos por ID para contarlos (simulando cantidad)
    const carritoAgrupado = carrito.reduce((acumulador, producto) => {
        if (!acumulador[producto.id]) {
            acumulador[producto.id] = { ...producto, cantidad: 1 };
        } else {
            acumulador[producto.id].cantidad++;
        }
        return acumulador;
    }, {});

    const productosUnicos = Object.values(carritoAgrupado);

    if (productosUnicos.length === 0) {
        itemsCarrito.innerHTML = '<li class="list-group-item text-center text-muted">El carrito está vacío.</li>';
        totalCarrito.textContent = '$0.00';
        return;
    }

    let total = 0;

    productosUnicos.forEach(producto => {
        total += producto.precio * producto.cantidad;

        // Renderizar el ítem del listado (Bootstrap List Group)
        const item = document.createElement('li');
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        item.innerHTML = `
            <div>
                <span class="badge bg-secondary me-2">${producto.cantidad}</span>
                ${producto.nombre}
            </div>
            <div>
                <span class="text-danger fw-bold me-3">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
                <button class="btn btn-sm btn-outline-danger eliminar-producto" data-id="${producto.id}">
                    X
                </button>
            </div>
        `;
        itemsCarrito.appendChild(item);
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function eliminarProducto(e) {
    if (e.target.classList.contains('eliminar-producto')) {
        const idEliminar = parseInt(e.target.dataset.id);
        
        // Encontrar el índice de la PRIMERA ocurrencia de ese ID
        const indice = carrito.findIndex(p => p.id === idEliminar);
        
        // Eliminar solo una unidad del producto encontrado
        if (indice !== -1) {
            carrito.splice(indice, 1);
        }

        actualizarContadorCarrito(); // Actualiza el contador
        renderizarCarrito();        // Vuelve a renderizar el listado
    }
}

// Función para simular la compra (vacía el carrito)
function simularCompra() {
    if (carrito.length > 0) {
        alert("¡Compra realizada con éxito! Recibirás tu pedido en breve.");
        carrito = []; // Vaciar el carrito
        actualizarContadorCarrito();
        renderizarCarrito();
    } else {
        alert("Tu carrito está vacío.");
    }
}

// Función para vaciar completamente el carrito
function vaciarCarrito() {
    if (confirm("¿Estás seguro que deseas vaciar el carrito?")) {
        carrito = [];
        actualizarContadorCarrito();
        renderizarCarrito();
    }
}


// Event Listeners específicos del Carrito
if (itemsCarrito) {
    itemsCarrito.addEventListener('click', eliminarProducto);
    botonComprar.addEventListener('click', simularCompra);
    botonVaciar.addEventListener('click', vaciarCarrito);
}

// Modificar la inicialización para que llame a la función de carrito si estamos en esa página
document.addEventListener('DOMContentLoaded', () => {
    // ... (Mantener la lógica de index y detalle del paso anterior) ...
    // Si estamos en la página de inicio, renderiza productos
    if (document.querySelector('#productos')) {
        renderizarProductos();
    }
    // Si estamos en la página de detalle, renderiza el detalle
    if (document.querySelector('#detalle-producto')) {
        renderizarDetalle();
    }
    // Si estamos en la página de carrito, renderiza el carrito
    if (itemsCarrito) {
        renderizarCarrito();
    }
    
    // El contador se actualiza en todas las páginas
    actualizarContadorCarrito();
});