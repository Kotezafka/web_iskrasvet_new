class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(productId, title, price, image, stock) {
        const existingItem = this.items.find(item => item.id === productId);
        const stockCount = typeof stock === 'number' ? stock : null;
        if (existingItem) {
            if (stockCount !== null && existingItem.quantity >= stockCount) {
                alert('Недостаточно товаров на складе!');
                return;
            }
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                title: title,
                price: price,
                image: image,
                quantity: 1
            });
        }
        this.saveCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
            }
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/\s/g, '').replace('руб', ''));
            return total + (price * item.quantity);
        }, 0);
    }

    updateCartCount() {
        const cartCountElement = document.getElementById('cart-item-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getTotalItems();
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }
}

const cart = new Cart();
window.cart = cart; 