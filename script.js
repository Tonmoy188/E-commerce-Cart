'use strict';
// Product class
class Product {
  constructor(id, name, price, category, image, description) {
    this.id=id;
    this.name=name;
    this.price=price;
    this.category=category;
    this.image=image;
    this.description=description;
  }

  getFormattedPrice() {
   return '$' + this.price.toFixed(2);
  }
}


// Cart class
class Cart {
  constructor() {
    this.items      = [];
    this.categories = new Set();
  }

  addItem(product) {
        const existing = this.items.find(item => item.product.id === product.id);
        if(existing){
            existing.quantity++;
        }
        else{
            this.items.push({product,quantity:1});
        } this.categories.add(product.category);
        renderCart();
        showToast(`${product.name} added to cart`);
  }

  removeItem(productId) {
    this.items=this.items.filter(item => item.product.id!=productId);
    this.categories=new Set();
    this.items.forEach(item => this.categories.add(item.product.category));
    renderCart();
    const product=products.find(p=>p.id===productId);
    if(product){
    showToast(`${product.name} removed from cart`);
    }
  }

  getTotal() {
    return this.items.reduce((acc,item)=>acc+(item.product.price*item.quantity),0);
  }

  getItemCount() {
    return this.items.reduce((acc,item)=>acc+item.quantity,0);
  }

  clear() {
    this.items=[];  //new array
    this.categories=new Set(); //new set
    renderCart();
    showToast(` cleared the cart`);

  }
}


//Product data
const products = [
  new Product(
    1, 'Wireless Mouse', 29.99, 'Electronics',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600',
    'Ergonomic. Silent clicks. 60-day battery.'
  ),
  new Product(
    2, 'Mechanical Keyboard', 89.99, 'Electronics',
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600',
    'Tactile switches. Full TKL layout.'
  ),
  new Product(
    3, 'Leather Notebook', 18.99, 'Stationery',
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=600',
    'A5 size. 200 dot-grid pages.'
  ),
  new Product(
    4, 'Ballpoint Pen Set', 12.99, 'Stationery',
    'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600',
    'Smooth writing. Set of 12 colors.'
  ),
  new Product(
    5, 'Minimalist Desk Lamp', 49.99, 'Furniture',
    'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=600',
    'Touch dimmer. Warm & cool light modes.'
  ),
  new Product(
    6, 'Monitor Stand', 39.99, 'Furniture',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=600',
    'Solid bamboo. Raises screen 4.7 inches.'
  ),
  new Product(
    7, 'Noise-Cancelling Headphones', 129.99, 'Electronics',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    '40hr battery. Foldable. Deep bass.'
  ),
  new Product(
    8, 'Desk Organiser', 22.99, 'Furniture',
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600',
    'Holds pens, cards, phone & more.'
  ),
];

const cart = new Cart();
let activeFilter = 'All';



//Render products
function renderProducts() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('product-count');

  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => p.category === activeFilter);

  if (countEl) countEl.textContent = `${filtered.length} items`;

  if (grid) {
    grid.innerHTML = filtered.map(p => {
      const inCart = cart.items.find(item => item.product.id === p.id);
      return `
        <div class="product-card">
          <div class="product-image-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <span class="product-badge">${p.category}</span>
          </div>
          <div class="product-info">
            <div class="product-name">${p.name}</div>
            <div class="product-desc">${p.description}</div>
            <div class="product-bottom">
              <span class="product-price">${p.getFormattedPrice ? p.getFormattedPrice() : ''}</span>
              <button
                class="btn-add ${inCart ? 'in-cart' : ''}"
                onclick="addToCart(${p.id})"
              >
                ${inCart ? `In cart (${inCart.quantity})` : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}



//Render cart drawer
function renderCart() {
  const emptyEl    = document.getElementById('cart-empty');
  const listEl     = document.getElementById('cart-items-list');
  const totalEl    = document.getElementById('cart-total');
  const subtotalEl = document.getElementById('subtotal');
  const badgeEl    = document.getElementById('cart-badge');
  const catTagsEl  = document.getElementById('cat-tags');

    if(cart.items.length===0){
        emptyEl.style.display='flex';
    }
    else{
        emptyEl.style.display='none';
    }

    listEl.innerHTML = cart.items.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.product.image}" alt="${item.product.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-qty">Qty: ${item.quantity}</div>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">$${(item.product.price * item.quantity).toFixed(2)}</span>
        <button class="btn-remove" onclick="removeFromCart(${item.product.id})">Remove</button>
      </div>
    </div>
  `).join('');

  //Update total, subtotal, and badge count
  const totalValue = cart.getTotal().toFixed(2);
  totalEl.textContent    = `$${totalValue}`;
  subtotalEl.textContent = `$${totalValue}`;
  badgeEl.textContent    = cart.getItemCount();

  //Render category tags using the Set
  catTagsEl.innerHTML = [...cart.categories]
    .map(c => `<span class="cat-tag">${c}</span>`)
    .join('') || '<span class="cat-tag" style="opacity:0.5">—</span>';
  renderProducts();
}



//Button actions
function addToCart(productId) {
  const product=products.find(p=>p.id===productId);
  cart.addItem(product);
}

function removeFromCart(productId) {
  cart.removeItem(productId);
}

function clearCart() {
  cart.clear();
}

function filterProducts(category, btn) {
  activeFilter = category;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function toggleCart() {
  const drawer  = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer) drawer.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}



//Toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }
}



// Start the app
renderProducts();
renderCart();