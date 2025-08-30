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
                <p class="mb-0 text-muted">Cantidad: ${product.quantity}</p>
            </div>
            <strong class="text-nowrap">$${(product.price * product.quantity).toFixed(2)}</strong>
            <button class="btn btn-sm btn-danger ms-2" onclick="removeItem(${index})">X</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });
}

// Eliminar producto del carrito
function removeItem(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCart();
    updateTotal();
}

// Calcular total
function updateTotal() {
    const total = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

// Finalizar compra y generar PDF
function checkout() {
    if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "Agrega productos antes de comprar.", "warning");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Factura de compra", 10, 10);

    doc.setFontSize(12);
    let y = 30;
    carrito.forEach(item => {
        doc.text(`${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`, 10, y);
        y += 10;
    });

    y += 10;
    const total = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    doc.text(`TOTAL: $${total.toFixed(2)}`, 10, y);

    doc.save("Factura.pdf");

    // Vaciar carrito después de la compra
    carrito = [];
    localStorage.removeItem("carrito");
    renderCart();
    updateTotal();

    Swal.fire({
        title: "¡Compra realizada!",
        text: "Tu factura ha sido generada. ¿Quieres seguir comprando",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No, Salir"
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