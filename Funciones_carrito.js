const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const checkoutButton = document.getElementById("checkout");

let carrito = [];

// Cargar carrito desde localStorage
function loadCart() {
    const storedCart = localStorage.getItem("carrito");
    if (storedCart) {
        carrito = JSON.parse(storedCart);
        renderCart();
        updateTotal();
    }
}

// Renderizar productos en la página del carrito
function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = "<p class='text-muted'>Tu carrito está vacío.</p>";
        return;
    }

    carrito.forEach((product, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("d-flex", "align-items-center", "mb-3", "border-bottom", "pb-3");

        itemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}" 
                 style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px;">
            <div style="flex-grow: 1;">
                <h6 class="mb-0">${product.title}</h6>
                <div class="d-flex align-items-center mt-1">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="mx-2">${product.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <strong class="text-nowrap">$${(product.price * product.quantity).toFixed(2)}</strong>
            <button class="btn btn-sm btn-danger ms-2" onclick="removeItem(${index})">X</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });
}

// Actualizar la cantidad de un producto
function updateQuantity(index, change) {
    const product = carrito[index];
    const newQuantity = product.quantity + change;

    if (newQuantity <= 0) {
        // Si la cantidad es 0 o menos, eliminar el producto
        removeItem(index);
    } else {
        product.quantity = newQuantity;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderCart();
        updateTotal();
    }
}

// Eliminar producto del carrito
function removeItem(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCart();
    updateTotal();
}

// Calcular el total con impuestos
function updateTotal() {
    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.13;
    const finalTotal = subtotal + tax;
    totalPriceElement.textContent = `$${finalTotal.toFixed(2)}`;
}

// Finalizar compra y generar PDF
function checkout() {
    if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "Agrega productos antes de comprar.", "warning");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Ruvo SA. de CV", 10, 15);
    doc.setFontSize(10);
    doc.text("Dirección: Calle San Rafael 25 Ahuachapan", 10, 22);
    doc.text("adminJorge95@ruvosv.com", 10, 27);
    doc.text("Teléfono: +503 70009595", 10, 32);
    doc.setFontSize(18);
    doc.text("Factura de Compra", 10, 45);

    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    doc.setFontSize(10);
    doc.text(`Fecha: ${formattedDate}`, 150, 45);
    let y = 60;
    doc.setFontSize(12);
    doc.text("Descripción", 10, y);
    doc.text("Cantidad", 120, y);
    doc.text("Subtotal", 170, y);
    y += 5;
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y);
    y += 10;
    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    carrito.forEach(item => {
        doc.text(item.title, 10, y);
        doc.text(`${item.quantity}`, 120, y);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, y);
        y += 10;
    });
    
    const tax = subtotal * 0.13;
    const finalTotal = subtotal + tax;
    y += 10;
    doc.setFontSize(12);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 160, y);
    y += 10;
    doc.text(`Impuestos (13%): $${tax.toFixed(2)}`, 160, y);
    y += 10;
    doc.setFontSize(14);
    doc.text(`TOTAL: $${finalTotal.toFixed(2)}`, 160, y);
    
    doc.setFontSize(10);
    doc.text("¡Gracias por tu compra!", 10, 280);
    doc.save("Factura.pdf");
    
    carrito = [];
    localStorage.removeItem("carrito");
    renderCart();
    updateTotal();

    Swal.fire({
        title: "¡Compra realizada!",
        text: "Tu factura ha sido generada en PDF. ¿Quieres regresar a la página principal?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí, regresar",
        cancelButtonText: "No, quedarme"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "index.html";
        }
    });
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
});

checkoutButton.addEventListener("click", checkout);

