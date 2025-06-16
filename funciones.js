
document.addEventListener('DOMContentLoaded', () => {

    //Carrusel de Fondo en la Sección de Inicio
    const backgroundImages = document.querySelectorAll('.background-carousel img');
    let currentBackgroundIndex = 0;

    if (backgroundImages.length > 0) {
        function showNextBackgroundImage() {
            backgroundImages[currentBackgroundIndex].classList.remove('active');
            currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
            backgroundImages[currentBackgroundIndex].classList.add('active');
        }

        backgroundImages[currentBackgroundIndex].classList.add('active');
        setInterval(showNextBackgroundImage, 7000);
    }

    //carruseles
    const allCarouselContainers = document.querySelectorAll('.carousel-container');

    allCarouselContainers.forEach(container => {
        const carouselSlide = container.querySelector('.carousel-slide');
        if (!carouselSlide) return; 

        const images = carouselSlide.querySelectorAll('img');
        const prevBtn = container.querySelector('.carousel-btn.prev');
        const nextBtn = container.querySelector('.carousel-btn.next');

        let counter = 0;
        let slideWidth = carouselSlide.clientWidth;


        carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;

        // Botón "Siguiente"
        nextBtn.addEventListener('click', () => {
            if (counter >= images.length - 1) {
                counter = 0;
            } else {
                counter++;
            }
            carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;
        });

        // Botón "Anterior"
        prevBtn.addEventListener('click', () => {
            if (counter <= 0) {
                counter = images.length - 1;
            } else {
                counter--;
            }
            carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;
        });

        window.addEventListener('resize', () => {
            slideWidth = carouselSlide.clientWidth; 
            carouselSlide.style.transform = `translateX(${-slideWidth * counter}px)`;
        });

        // Carrusel automático
        let autoSlideInterval;
        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(() => {
                nextBtn.click();
            }, 5000); // Cambia de imagen cada 5 segundos
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        startAutoSlide();
        carouselSlide.addEventListener('mouseenter', stopAutoSlide);
        carouselSlide.addEventListener('mouseleave', startAutoSlide);
    });

    //Lógica del Carrito de Compra Desplegable
    const cartButton = document.getElementById('cart-button');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartCountSpan = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');

    let cart = [];

    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem('medellinCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
        updateCartDisplay();
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('medellinCart', JSON.stringify(cart));
    }

    function updateCartDisplay() {
        cartCountSpan.textContent = cart.length;
        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            const ul = document.createElement('ul');
            cart.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${item.name}</span> <button class="remove-from-cart-btn" data-product-id="${item.id}">X</button>`;
                ul.appendChild(li);
            });
            cartItemsList.appendChild(ul);
        }
        addRemoveButtonListeners();
    }

    function addToCart(productId, productName) {
        const existingItem = cart.find(item => item.id === productId);
        if (!existingItem) {
            cart.push({ id: productId, name: productName });
            saveCartToLocalStorage();
            updateCartDisplay();
            alert(`"${productName}" agregado al carrito.`);
        } else {
            alert(`"${productName}" ya está en tu carrito.`);
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCartToLocalStorage();
        updateCartDisplay();
    }

    function clearCart() {
        if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
            cart = [];
            saveCartToLocalStorage();
            updateCartDisplay();
            alert('Tu carrito ha sido vaciado.');
        }
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
            addToCart(productId, productName);
        });
    });

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            cartDropdown.classList.toggle('open');
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartDropdown.classList.remove('open');
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    function addRemoveButtonListeners() {
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                removeFromCart(productId);
            });
        });
    }

    loadCartFromLocalStorage();

});