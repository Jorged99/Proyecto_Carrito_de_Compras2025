// Variable para almacenar el estado del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const countProducts = document.querySelector('.count-products');
countProducts.innerText = carrito.length;

// Manejador de eventos para los botones "Agregar al carrito" cambios cambio de ejemplo
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    const btn = card.querySelector('.add-to-cart');
    btn.addEventListener('click', e => {
        const productId = card.dataset.productId;
        const title = card.querySelector('.card-title').innerText;
        // Se extrae el precio y se convierte a número
        const price = parseFloat(card.querySelector('.price').innerText.replace('$', ''));
        const image = card.querySelector('.card-img-top').src;

        // Verificar si el producto ya está en el carrito
        const existingProduct = carrito.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            // Crear el objeto del producto con cantidad y imagen
            const producto = {
                id: productId,
                title: title,
                price: price,
                image: image,
                quantity: 1
            };
            carrito.push(producto);
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        countProducts.innerText = carrito.length;
        console.log(carrito);

        // Mostrar alerta de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Producto agregado!',
            text: 'El producto se ha añadido al carrito.',
            showConfirmButton: false,
            timer: 1500
        });
    });
});


