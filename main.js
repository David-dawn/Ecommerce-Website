document.addEventListener('DOMContentLoaded', function() {
    const apiURL = 'https://fakestoreapi.com';
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function fetchFeaturedProducts() {
        fetch(`${apiURL}/products?limit=4`)
            .then(response => response.json())
            .then(data => {
                const featuredProductsContainer = document.getElementById('featured-products');
                let content = '';
                data.forEach(product => {
                    content += `
                        <div class="product-item">
                            <img src="${product.image}" alt="${product.title}">
                            <h3>${product.title}</h3>
                            <p>$${product.price}</p>
                            <a href="product.html?id=${product.id}" class="btn">View Product</a>
                        </div>
                    `;
                });
                featuredProductsContainer.innerHTML = content;
            })
            .catch(error => console.error('Error fetching featured products:', error));
    }

    function fetchProductDetails(productId) {
        fetch(`${apiURL}/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                const productGallery = document.getElementById('product-gallery');
                const productDetails = document.getElementById('product-details');

                productGallery.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                `;
                productDetails.innerHTML = `
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                    <button class="btn" id="add-to-cart" data-id="${product.id}">Add to Cart</button>
                `;
                document.getElementById('add-to-cart').addEventListener('click', function() {
                    addToCart(product.id);
                });
            })
            .catch(error => console.error('Error fetching product details:', error));
    }
 
    function addToCart(productId) {
        fetch(`${apiURL}/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                const cartItem = cart.find(item => item.id === productId);
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                alert(`${product.title} has been added to your cart.`);
            })
            .catch(error => console.error('Error adding product to cart:', error));
    }

    function updateCartCount() {
        document.getElementById('cart-count').textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function displayCart() {
        const cartSummary = document.getElementById('cart-summary');
        let content = '';
        cart.forEach(item => {
            content += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div>
                        <h3>${item.title}</h3>
                        <p>$${item.price} x ${item.quantity}</p>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        });
        cartSummary.innerHTML = content;
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    
        updateCartTotals();
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }

    function updateCartTotals() {
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
    }

    function displayOrderSummary() {
        const orderSummary = document.getElementById('order-summary');
        let content = '';
        cart.forEach(item => {
            content += `
                <div class="order-item">
                    <p>${item.title} x ${item.quantity}</p>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
        });
        orderSummary.innerHTML = content;
        document.getElementById('order-total').textContent = `$${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`;
    }

    if (document.getElementById('featured-products')) {
        fetchFeaturedProducts();
    }

    if (document.getElementById('product-gallery')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        fetchProductDetails(productId);
    }

    if (document.getElementById('cart-summary')) {
        displayCart();
    }

    if (document.getElementById('order-summary')) {
        displayOrderSummary();
    }

    updateCartCount();
});
