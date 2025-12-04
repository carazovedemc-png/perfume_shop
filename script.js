// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ =====
const tg = window.Telegram.WebApp;
let user = null;
let allProducts = [];
let cart = [];
let favorites = [];
let filteredProducts = [];
let currentCategory = 'all';
let adminList = ['@ваш_username']; // Замените на ваш юзернейм
let isAdmin = false;

// Ключи для localStorage
const STORAGE_KEYS = {
    CART: 'parfume_cart',
    FAVORITES: 'parfume_favorites',
    USER: 'parfume_user'
};

// Примеры товаров (в реальном приложении загружаются с сервера)
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Amouage Interlude",
        description: "Эксклюзивный арабский парфюм с нотами ладана, кожи и специй. Для настоящих ценителей роскоши.",
        price: 28500,
        oldPrice: 32000,
        category: "arabian",
        volume: 100,
        rating: 4.8,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "sale",
        inStock: true,
        popular: true,
        notes: ["ладан", "кожа", "специи"]
    },
    {
        id: 2,
        name: "Chanel №5 L'EAU",
        description: "Современная интерпретация классики с цитрусовыми и цветочными нотами.",
        price: 8900,
        oldPrice: 10500,
        category: "premium",
        volume: 100,
        rating: 4.9,
        reviews: 256,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["цитрус", "цветы", "мускус"]
    },
    {
        id: 3,
        name: "Zara Tobacco Collection",
        description: "Доступный аромат с нотами табака, ванили и древесины. Идеален на каждый день.",
        price: 1999,
        oldPrice: 2499,
        category: "affordable",
        volume: 100,
        rating: 4.3,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1590736969956-6d9c2a8d6971?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "sale",
        inStock: true,
        popular: false,
        notes: ["табак", "ваниль", "древесина"]
    },
    {
        id: 4,
        name: "Oud Ispahan Dior",
        description: "Роскошный арабский уд с нотами розы, сандала и пачули. Для особых вечеров.",
        price: 42000,
        oldPrice: 0,
        category: "arabian",
        volume: 75,
        rating: 4.9,
        reviews: 67,
        image: "https://images.unsplash.com/photo-1590736969956-6d9c2a8d6971?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "new",
        inStock: true,
        popular: true,
        notes: ["уд", "роза", "сандал"]
    },
    {
        id: 5,
        name: "Jo Malone Wood Sage",
        description: "Уникальный аромат с нотами шалфея, морской соли и древесины.",
        price: 12500,
        oldPrice: 14500,
        category: "premium",
        volume: 100,
        rating: 4.7,
        reviews: 187,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["шалфей", "морская соль", "древесина"]
    },
    {
        id: 6,
        name: "Montblanc Explorer",
        description: "Современный мужской аромат с аккордами бергамота, кедра и пачули.",
        price: 6500,
        oldPrice: 0,
        category: "affordable",
        volume: 100,
        rating: 4.5,
        reviews: 92,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["бергамот", "кедр", "пачули"]
    },
    {
        id: 7,
        name: "Tom Ford Black Orchid",
        description: "Чувственный аромат с нотами черной трюфели, орхидеи и пачули.",
        price: 18500,
        oldPrice: 21000,
        category: "premium",
        volume: 100,
        rating: 4.8,
        reviews: 143,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "sale",
        inStock: true,
        popular: true,
        notes: ["трюфель", "орхидея", "пачули"]
    },
    {
        id: 8,
        name: "Lattafa Oud Mood",
        description: "Аутентичный арабский аромат с глубокими нотами уда и розы.",
        price: 3500,
        oldPrice: 0,
        category: "arabian",
        volume: 100,
        rating: 4.6,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1590736969956-6d9c2a8d6971?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "new",
        inStock: true,
        popular: true,
        notes: ["уд", "роза", "амбра"]
    },
    {
        id: 9,
        name: "Davidoff Cool Water",
        description: "Классический свежий аромат с нотами моря и свежести.",
        price: 3800,
        oldPrice: 4500,
        category: "affordable",
        volume: 125,
        rating: 4.4,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "sale",
        inStock: true,
        popular: true,
        notes: ["морские ноты", "свежесть", "мускус"]
    },
    {
        id: 10,
        name: "Creed Aventus",
        description: "Культовый аромат с нотами ананаса, черной смородины и мускуса.",
        price: 35000,
        oldPrice: 0,
        category: "premium",
        volume: 100,
        rating: 4.9,
        reviews: 189,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["ананас", "смородина", "мускус"]
    },
    {
        id: 11,
        name: "Rasasi Hawas",
        description: "Современный арабский аромат с акватическими и фруктовыми нотами.",
        price: 4200,
        oldPrice: 0,
        category: "arabian",
        volume: 100,
        rating: 4.5,
        reviews: 78,
        image: "https://images.unsplash.com/photo-1590736969956-6d9c2a8d6971?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["акватик", "фрукты", "мускус"]
    },
    {
        id: 12,
        name: "Bvlgari Man In Black",
        description: "Темный и загадочный аромат с нотами рома, кожи и ванили.",
        price: 9200,
        oldPrice: 11000,
        category: "premium",
        volume: 100,
        rating: 4.6,
        reviews: 112,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        badge: "sale",
        inStock: true,
        popular: true,
        notes: ["ром", "кожа", "ваниль"]
    }
];

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadData();
    initEventListeners();
    renderProducts();
    updateCartCount();
    updateFavoritesCount();
});

function initApp() {
    // Инициализация Telegram WebApp
    if (tg.initDataUnsafe?.user) {
        user = {
            id: tg.initDataUnsafe.user.id,
            username: tg.initDataUnsafe.user.username || `user_${tg.initDataUnsafe.user.id}`,
            firstName: tg.initDataUnsafe.user.first_name,
            lastName: tg.initDataUnsafe.user.last_name
        };
        
        tg.expand();
        tg.setHeaderColor('#ffffff');
        tg.setBackgroundColor('#f8f9fa');
        
        console.log('Пользователь Telegram:', user);
    } else {
        // Режим демо (вне Telegram)
        user = {
            id: 1,
            username: 'demo_user',
            firstName: 'Демо',
            lastName: 'Пользователь'
        };
        console.log('Режим демо (вне Telegram)');
    }
    
    // Проверка админских прав
    checkAdminStatus();
    
    // Сохраняем пользователя в localStorage
    saveToStorage(STORAGE_KEYS.USER, user);
}

function checkAdminStatus() {
    const username = user.username.startsWith('@') ? user.username : `@${user.username}`;
    isAdmin = adminList.includes(username);
    console.log('Админ статус:', isAdmin, 'для пользователя', username);
    
    if (isAdmin) {
        showAdminFeatures();
    }
}

function showAdminFeatures() {
    // Добавляем кнопку админ-панели в навигацию
    const navLeft = document.querySelector('.nav-left');
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.className = 'nav-link';
    adminLink.innerHTML = '<i class="fas fa-crown"></i> Админ';
    adminLink.target = '_blank';
    navLeft.appendChild(adminLink);
}

// ===== LOCALSTORAGE ФУНКЦИИ =====
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Данные сохранены в localStorage: ${key}`);
    } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Ошибка загрузки из localStorage:', e);
        return defaultValue;
    }
}

function loadData() {
    // Загружаем товары
    allProducts = PRODUCTS_DATA;
    filteredProducts = [...allProducts];
    
    // Загружаем корзину из localStorage
    cart = loadFromStorage(STORAGE_KEYS.CART, []);
    
    // Загружаем избранное из localStorage
    favorites = loadFromStorage(STORAGE_KEYS.FAVORITES, []);
    
    console.log('Данные загружены:', {
        products: allProducts.length,
        cart: cart.length,
        favorites: favorites.length
    });
}

// ===== РЕНДЕРИНГ ТОВАРОВ =====
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--color-text-muted); margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 10px; color: var(--color-text);">Товары не найдены</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: 20px;">Попробуйте изменить параметры поиска или фильтры</p>
                <button class="btn-filter-reset" onclick="resetFilters()" style="margin: 0 auto;">Сбросить фильтры</button>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const isInCart = cart.some(item => item.id === product.id);
        const isInFavorites = favorites.some(item => item.id === product.id);
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        
        // Определяем бейдж
        let badgeHtml = '';
        if (product.badge === 'new') {
            badgeHtml = '<span class="badge-new">Новинка</span>';
        } else if (product.badge === 'sale') {
            badgeHtml = '<span class="badge-sale">Скидка</span>';
        } else if (product.badge === 'hit') {
            badgeHtml = '<span class="badge-hit">Хит</span>';
        }
        
        // Расчет скидки
        const discountPercent = product.oldPrice > 0 
            ? Math.round((1 - product.price / product.oldPrice) * 100)
            : 0;
        
        card.innerHTML = `
            <div class="product-badges">
                ${badgeHtml}
            </div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-category">${getCategoryName(product.category)} • ${product.volume} мл</div>
            <div class="product-rating">
                <div class="stars-filled">
                    ${renderStars(product.rating)}
                </div>
                <span class="rating-value">${product.rating}</span>
                <span class="reviews-count">(${product.reviews})</span>
            </div>
            <div class="product-prices">
                <span class="price-current">${product.price.toLocaleString()} ₽</span>
                ${product.oldPrice > 0 ? `
                    <span class="price-old">${product.oldPrice.toLocaleString()} ₽</span>
                    <span class="discount-percent">-${discountPercent}%</span>
                ` : ''}
            </div>
            <div class="product-actions">
                <button class="btn-cart ${isInCart ? 'in-cart' : ''}" onclick="toggleCart(${product.id}, event)">
                    ${isInCart ? '<i class="fas fa-check"></i> В корзине' : '<i class="fas fa-shopping-cart"></i> В корзину'}
                </button>
                <button class="btn-fav ${isInFavorites ? 'active' : ''}" onclick="toggleFavorite(${product.id}, event)">
                    <i class="${isInFavorites ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        `;
        
        // Добавляем обработчик клика на карточку
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.product-actions')) {
                showProductModal(product);
            }
        });
        
        grid.appendChild(card);
    });
}

function renderStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// ===== КОРЗИНА =====
function toggleCart(productId, event) {
    if (event) event.stopPropagation();
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Удаляем из корзины
        cart = cart.filter(item => item.id !== productId);
        showNotification(`${product.name} удален из корзины`, 'info');
    } else {
        // Добавляем в корзину
        cart.push({
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
        showNotification(`${product.name} добавлен в корзину`, 'success');
    }
    
    // Сохраняем в localStorage
    saveToStorage(STORAGE_KEYS.CART, cart);
    
    // Обновляем UI
    updateCartCount();
    updateCartPopup();
    renderProducts(); // Обновляем кнопки в карточках
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function updateCartPopup() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartFinal = document.getElementById('cartFinal');
    
    if (!cartItems || !cartTotal || !cartFinal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--color-text-muted); margin-bottom: 20px; opacity: 0.3;"></i>
                <p style="color: var(--color-text-secondary); margin-bottom: 20px;">Ваша корзина пуста</p>
                <button class="btn-browse" onclick="closeCartPopup()">Перейти к покупкам</button>
            </div>
        `;
        cartTotal.textContent = '0 ₽';
        cartFinal.textContent = '0 ₽';
        return;
    }
    
    // Рассчитываем итоги
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cart.reduce((sum, item) => {
        if (item.oldPrice > 0) {
            return sum + ((item.oldPrice - item.price) * item.quantity);
        }
        return sum;
    }, 0);
    const total = subtotal;
    
    // Рендерим товары
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" onchange="updateQuantity(${item.id}, 0, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <div class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    // Обновляем суммы
    cartTotal.textContent = `${subtotal.toLocaleString()} ₽`;
    cartFinal.textContent = `${total.toLocaleString()} ₽`;
}

function updateQuantity(productId, delta, newValue = null) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (newValue !== null) {
        item.quantity = parseInt(newValue) || 1;
    } else {
        item.quantity += delta;
    }
    
    // Ограничения
    if (item.quantity < 1) item.quantity = 1;
    if (item.quantity > 10) item.quantity = 10;
    
    // Сохраняем
    saveToStorage(STORAGE_KEYS.CART, cart);
    
    // Обновляем UI
    updateCartCount();
    updateCartPopup();
    renderProducts();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Сохраняем
    saveToStorage(STORAGE_KEYS.CART, cart);
    
    // Обновляем UI
    updateCartCount();
    updateCartPopup();
    renderProducts();
    
    showNotification('Товар удален из корзины', 'info');
}

// ===== ИЗБРАННОЕ =====
function toggleFavorite(productId, event) {
    if (event) event.stopPropagation();
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = favorites.findIndex(item => item.id === productId);
    
    if (existingIndex !== -1) {
        // Удаляем из избранного
        favorites.splice(existingIndex, 1);
        showNotification(`${product.name} удален из избранного`, 'info');
    } else {
        // Добавляем в избранное
        favorites.push({
            ...product,
            addedAt: new Date().toISOString()
        });
        showNotification(`${product.name} добавлен в избранное`, 'success');
    }
    
    // Сохраняем в localStorage
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
    
    // Обновляем UI
    updateFavoritesCount();
    updateFavoritesPopup();
    renderProducts();
}

function updateFavoritesCount() {
    const favCount = document.getElementById('favoritesCount');
    
    if (favCount) {
        favCount.textContent = favorites.length;
        favCount.style.display = favorites.length > 0 ? 'flex' : 'none';
    }
}

function updateFavoritesPopup() {
    const favItems = document.getElementByI