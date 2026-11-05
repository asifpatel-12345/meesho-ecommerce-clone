// Mock Product Dataset
const products = [
  {
    id: 1,
    title: "Ethnic Heavy Silk Printed Saree",
    price: 349,
    oldPrice: 899,
    category: "women",
    freeDelivery: true,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Men Cotton Solid Slim Fit Shirt",
    price: 299,
    oldPrice: 599,
    category: "men",
    freeDelivery: true,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Wireless Bluetooth Smart Earbuds",
    price: 499,
    oldPrice: 1299,
    category: "electronics",
    freeDelivery: false,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Men Lightweight Running Shoes",
    price: 429,
    oldPrice: 999,
    category: "footwear",
    freeDelivery: true,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Women Anarkali Kurti & Pant Set",
    price: 549,
    oldPrice: 1499,
    category: "women",
    freeDelivery: true,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Smart Fitness Watch with Heart Rate Sensor",
    price: 799,
    oldPrice: 2499,
    category: "electronics",
    freeDelivery: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop"
  }
];

// App State Management
let cart = JSON.parse(localStorage.getItem('meesho_cart')) || [];
let activeCategory = 'all';

// DOM Element References
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const priceSort = document.getElementById('priceSort');
const freeDeliveryFilter = document.getElementById('freeDeliveryFilter');
const categoryChips = document.querySelectorAll('.cat-chip');

const cartToggle = document.getElementById('cartToggle');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartHeaderCount = document.getElementById('cartHeaderCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const productCountText = document.getElementById('productCount');

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  setupEventListeners();
});

// Render Product Grid with Filters Applied
function renderProducts() {
  let filtered = [...products];

  // Search Filter
  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
  }

  // Category Filter
  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  // Free Delivery Filter
  if (freeDeliveryFilter.checked) {
    filtered = filtered.filter(p => p.freeDelivery);
  }

  // Price Sorting
  const sortValue = priceSort.value;
  if (sortValue === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // Render Grid
  productsGrid.innerHTML = '';
  productCountText.textContent = `Showing ${filtered.length} items`;

  if (filtered.length === 0) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No matching products found.</p>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-image" />
      <div class="product-info">
        <h4 class="product-title">${product.title}</h4>
        <div class="product-price-row">
          <span class="product-price">₹${product.price}</span>
          <span class="product-old-price">₹${product.oldPrice}</span>
        </div>
        ${product.freeDelivery ? '<span class="product-badge">Free Delivery</span>' : ''}
        <button class="add-cart-btn" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// Add Item to Cart
window.addToCart = function(id) {
  const item = products.find(p => p.id === id);
  if (item) {
    cart.push(item);
    saveCart();
    updateCartUI();
    openCartDrawer();
  }
};

// Remove Item from Cart
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
};

// Save Cart State
function saveCart() {
  localStorage.setItem('meesho_cart', JSON.stringify(cart));
}

// Update Cart Count and Summary
function updateCartUI() {
  cartCount.textContent = cart.length;
  cartHeaderCount.textContent = cart.length;

  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin-top: 40px;">Your cart is empty!</p>`;
  } else {
    cart.forEach((item, index) => {
      total += item.price;
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">₹${item.price}</div>
          <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
  }

  cartTotalPrice.textContent = `₹${total}`;
}

// Drawer Visibility Controls
function openCartDrawer() {
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCartDrawer() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
}

// Event Listeners Registration
function setupEventListeners() {
  cartToggle.addEventListener('click', openCartDrawer);
  closeCart.addEventListener('click', closeCartDrawer);
  cartOverlay.addEventListener('click', closeCartDrawer);

  searchInput.addEventListener('input', renderProducts);
  priceSort.addEventListener('change', renderProducts);
  freeDeliveryFilter.addEventListener('change', renderProducts);

  categoryChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      categoryChips.forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-category');
      renderProducts();
    });
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
    } else {
      alert("Order Placed Successfully! Thank you for shopping with us.");
      cart = [];
      saveCart();
      updateCartUI();
      closeCartDrawer();
    }
  });
}