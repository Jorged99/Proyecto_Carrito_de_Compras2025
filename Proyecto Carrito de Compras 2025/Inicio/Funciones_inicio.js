let selectorproductos = document.querySelector(".productos");



//function

loadEventListener();

function loadEventListener(){

    selectorproductos.addEventListener("click", addProduct);

}



function addProduct(e){

    e.preventDefault();

    if(e.target.classList.contains("btn")){

        const selectPro = e.target.parentElement;

        readTheContent(selectPro);

    }

}



function readTheContent(product){

    const infoProduct = {

        image: product.querySelector("div img").src,

        title: product.querySelector(".card-title").textContent.addEventListen,

        price: product.querySelector("price")textContent.addEventListen,

    }

}
