// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ =====
const tg = window.Telegram?.WebApp || {};
let user = null;
let allProducts = [];
let cart = [];
let favorites = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 8;
let isFilterOpen = false;

// Ключи для localStorage
const STORAGE_KEYS = {
    CART: 'aura_atelier_cart',
    FAVORITES: 'aura_atelier_favorites',
    USER: 'aura_atelier_user'
};

// Примеры товаров (в реальном приложении загружаются с сервера)
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Aris 222 VIP Bleck",
        description: "демо",
        price: 450,
        oldPrice: 500,
        category: "arabian",
        volume: 100,
        rating: 4.8,
        reviews: 128,
        image: "https://images.satu.kz/227064425_w700_h500_maslyanye-duhi-al.jpg",
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
    setupFilterPopup();
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
        tg.setHeaderColor('#0F0F1E');
        tg.setBackgroundColor('#0F0F1E');
        
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
    
    // Сохраняем пользователя в localStorage
    saveToStorage(STORAGE_KEYS.USER, user);
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
    
    // Рассчитываем индексы для пагинации
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
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
    
    productsToShow.forEach(product => {
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
        
       
        
        grid.appendChild(card);
    });
    
    updatePagination();
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

// ===== ПАГИНАЦИЯ =====
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (!pageNumbers || !prevBtn || !nextBtn) return;
    
    // Очищаем номера страниц
    pageNumbers.innerHTML = '';
    
    // Показываем максимум 3 страницы
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    
    // Если мы в конце, корректируем startPage
    if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.dataset.page = i;
        pageBtn.addEventListener('click', () => goToPage(i));
        pageNumbers.appendChild(pageBtn);
    }
    
    // Обновляем состояние кнопок
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Добавляем обработчики
    prevBtn.onclick = () => goToPage(currentPage - 1);
    nextBtn.onclick = () => goToPage(currentPage + 1);
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    
    // Прокручиваем к началу товаров
    document.querySelector('.main-content').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
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
    renderProducts();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const bottomCartCount = document.getElementById('bottomCartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (bottomCartCount) {
        bottomCartCount.textContent = totalItems;
        bottomCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
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
                <button class="btn-browse-glass" onclick="closeCartPopup()">Перейти к покупкам</button>
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
    const total = subtotal - discount;
    
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
    // В данном интерфейсе счетчик избранного находится только в нижнем меню
    // Можно добавить при необходимости
}

function updateFavoritesPopup() {
    const favItems = document.getElementById('favoritesItems');
    const favEmpty = document.getElementById('favEmpty');
    
    if (!favItems || !favEmpty) return;
    
    if (favorites.length === 0) {
        favEmpty.style.display = 'block';
        favItems.innerHTML = '';
    } else {
        favEmpty.style.display = 'none';
        favItems.innerHTML = '';
        
        favorites.forEach(product => {
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${product.name}</h4>
                    <div class="cart-item-price">${product.price.toLocaleString()} ₽</div>
                    <div class="cart-item-controls">
                        <button class="btn-cart" onclick="toggleCart(${product.id}, event)">
                            <i class="fas fa-shopping-cart"></i> В корзину
                        </button>
                        <div class="remove-item" onclick="removeFromFavorites(${product.id})">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </div>
            `;
            favItems.appendChild(item);
        });
    }
}

function removeFromFavorites(productId) {
    favorites = favorites.filter(item => item.id !== productId);
    
    // Сохраняем
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
    
    // Обновляем UI
    updateFavoritesCount();
    updateFavoritesPopup();
    renderProducts();
    
    showNotification('Товар удален из избранного', 'info');
}

// ===== ФИЛЬТРЫ И ПОИСК =====
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const priceMin = parseInt(document.getElementById('filterPriceMin').value) || 0;
    const priceMax = parseInt(document.getElementById('filterPriceMax').value) || 50000;
    const sortBy = document.getElementById('sortBy').value;
    
    // Получаем выбранные категории
    const selectedCategories = Array.from(document.querySelectorAll('.filter-category:checked'))
        .map(cb => cb.value);
    
    // Получаем выбранные объемы
    const selectedVolumes = Array.from(document.querySelectorAll('.filter-volume:checked'))
        .map(cb => parseInt(cb.value));
    
    // Получаем выбранный рейтинг
    const selectedRating = document.querySelector('input[name="filterRating"]:checked');
    const minRating = selectedRating ? parseFloat(selectedRating.value) : 0;

    // Фильтрация
    filteredProducts = allProducts.filter(product => {
        // Поиск
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && 
            !product.description.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Категории
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        // Цена
        if (product.price < priceMin || product.price > priceMax) {
            return false;
        }
        
        // Объем
        if (selectedVolumes.length > 0 && !selectedVolumes.includes(product.volume)) {
            return false;
        }
        
        // Рейтинг
        if (product.rating < minRating) {
            return false;
        }
        
        return true;
    });
    
    // Сортировка
    switch(sortBy) {
        case 'new':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
        default:
            filteredProducts.sort((a, b) => {
                if (a.popular && !b.popular) return -1;
                if (!a.popular && b.popular) return 1;
                return b.reviews - a.reviews;
            });
            break;
    }
    
    // Сбрасываем на первую страницу
    currentPage = 1;
    renderProducts();
}

function resetFilters() {
    // Сбрасываем значения фильтров
    document.getElementById('searchInput').value = '';
    document.getElementById('filterPriceMin').value = '';
    document.getElementById('filterPriceMax').value = '';
    document.getElementById('sortBy').value = 'popular';
    
    // Сбрасываем чекбоксы категорий
    document.querySelectorAll('.filter-category').forEach(cb => {
        cb.checked = true;
    });
    
    // Сбрасываем чекбоксы объемов
    document.querySelectorAll('.filter-volume').forEach(cb => {
        cb.checked = false;
    });
    
    // Сбрасываем рейтинг
    document.querySelector('input[name="filterRating"][value="0"]').checked = true;
    
    // Закрываем попап фильтров
    closeFilterPopup();
    
    // Применяем фильтры
    filterProducts();
    
    showNotification('Фильтры сброшены', 'info');
}

function setupFilterPopup() {
    const filterContent = document.querySelector('.filter-content');
    if (!filterContent) return;
    
    // Создаем HTML для фильтров
    filterContent.innerHTML = `
        <div class="filter-group">
            <h4>Категории</h4>
            <div class="checkbox-group">
                <label class="checkbox">
                    <input type="checkbox" class="filter-category" value="arabian" checked>
                    <span class="checkmark"></span>
                    Арабские духи
                </label>
                <label class="checkbox">
                    <input type="checkbox" class="filter-category" value="premium" checked>
                    <span class="checkmark"></span>
                    Премиум
                </label>
                <label class="checkbox">
                    <input type="checkbox" class="filter-category" value="affordable" checked>
                    <span class="checkmark"></span>
                    Доступные
                </label>
            </div>
        </div>
        
        <div class="filter-group">
            <h4>Цена, ₽</h4>
            <div class="price-range">
                <div class="range-inputs">
                    <input type="number" id="filterPriceMin" placeholder="0" min="0">
                    <span class="range-divider">-</span>
                    <input type="number" id="filterPriceMax" placeholder="50000" min="0">
                </div>
                <div class="range-slider">
                    <input type="range" id="filterPriceRange" min="0" max="50000" value="25000">
                </div>
            </div>
        </div>
        
        <div class="filter-group">
            <h4>Объем, мл</h4>
            <div class="checkbox-group">
                <label class="checkbox">
                    <input type="checkbox" class="filter-volume" value="30">
                    <span class="checkmark"></span>
                    30 мл
                </label>
                <label class="checkbox">
                    <input type="checkbox" class="filter-volume" value="50">
                    <span class="checkmark"></span>
                    50 мл
                </label>
                <label class="checkbox">
                    <input type="checkbox" class="filter-volume" value="100">
                    <span class="checkmark"></span>
                    100 мл
                </label>
                <label class="checkbox">
                    <input type="checkbox" class="filter-volume" value="200">
                    <span class="checkmark"></span>
                    200 мл
                </label>
            </div>
        </div>
        
        <div class="filter-group">
            <h4>Рейтинг</h4>
            <div class="rating-filter">
                <label class="star-rating">
                    <input type="radio" name="filterRating" value="0" checked>
                    <span class="stars">
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                    </span>
                    <span class="rating-text">Любой</span>
                </label>
                <label class="star-rating">
                    <input type="radio" name="filterRating" value="3">
                    <span class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                    </span>
                    <span class="rating-text">3 и выше</span>
                </label>
                <label class="star-rating">
                    <input type="radio" name="filterRating" value="4">
                    <span class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </span>
                    <span class="rating-text">4 и выше</span>
                </label>
                <label class="star-rating">
                    <input type="radio" name="filterRating" value="4.5">
                    <span class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </span>
                    <span class="rating-text">4.5 и выше</span>
                </label>
            </div>
        </div>
        
        <div class="filter-buttons">
            <button class="btn-filter-apply" id="applyFilterBtn">
                <i class="fas fa-check"></i> Применить
            </button>
            <button class="btn-filter-reset" id="resetFilterBtn">
                <i class="fas fa-redo"></i> Сбросить
            </button>
        </div>
    `;
    
    // Настройка слайдера цены
    const priceRange = document.getElementById('filterPriceRange');
    const priceMinInput = document.getElementById('filterPriceMin');
    const priceMaxInput = document.getElementById('filterPriceMax');
    
    if (priceRange && priceMinInput && priceMaxInput) {
        priceRange.addEventListener('input', function() {
            const value = parseInt(this.value);
            priceMinInput.value = Math.max(0, value - 10000);
            priceMaxInput.value = Math.min(50000, value + 10000);
        });
        
        priceMinInput.addEventListener('change', function() {
            const min = parseInt(this.value) || 0;
            const max = parseInt(priceMaxInput.value) || 50000;
            priceRange.value = Math.floor((min + max) / 2);
        });
        
        priceMaxInput.addEventListener('change', function() {
            const min = parseInt(priceMinInput.value) || 0;
            const max = parseInt(this.value) || 50000;
            priceRange.value = Math.floor((min + max) / 2);
        });
    }
    
    // Обработчики для кнопок фильтра
    document.getElementById('applyFilterBtn')?.addEventListener('click', function() {
        filterProducts();
        closeFilterPopup();
        showNotification('Фильтры применены', 'success');
    });
    
    document.getElementById('resetFilterBtn')?.addEventListener('click', resetFilters);
}

// ===== МОДАЛЬНОЕ ОКНО ТОВАРА =====
function showProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    const isInCart = cart.some(item => item.id === product.id);
    const isInFavorites = favorites.some(item => item.id === product.id);
    
    const discountPercent = product.oldPrice > 0 
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-images">
                <img src="${product.image}" alt="${product.name}" class="modal-main-image">
            </div>
            <div class="modal-product-info">
                <div class="modal-badges">
                    ${product.badge === 'new' ? '<span class="badge-new">Новинка</span>' : ''}
                    ${product.badge === 'sale' ? '<span class="badge-sale">Скидка</span>' : ''}
                    ${product.badge === 'hit' ? '<span class="badge-hit">Хит</span>' : ''}
                </div>
                <h2 class="modal-product-title">${product.name}</h2>
                <div class="modal-product-meta">
                    <span class="modal-category">${getCategoryName(product.category)}</span>
                    <span class="modal-volume">${product.volume} мл</span>
                    <div class="modal-rating">
                        ${renderStars(product.rating)}
                        <span>${product.rating} (${product.reviews} отзывов)</span>
                    </div>
                </div>
                
                <div class="modal-description">
                    <h3>Описание</h3>
                    <p>${product.description}</p>
                </div>
                
                <div class="modal-notes">
                    <h3>Ноты аромата</h3>
                    <div class="notes-tags">
                        ${product.notes.map(note => `<span class="note-tag">${note}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-prices">
                    <div class="modal-price-current">
                        ${product.price.toLocaleString()} ₽
                    </div>
                    ${product.oldPrice > 0 ? `
                        <div class="modal-price-old">
                            <span>${product.oldPrice.toLocaleString()} ₽</span>
                            <span class="modal-discount">-${discountPercent}%</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="modal-actions">
                    <button class="modal-btn-cart ${isInCart ? 'in-cart' : ''}" onclick="toggleCart(${product.id})">
                        ${isInCart ? '<i class="fas fa-check"></i> В корзине' : '<i class="fas fa-shopping-cart"></i> В корзину'}
                    </button>
                    <button class="modal-btn-fav ${isInFavorites ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                        <i class="${isInFavorites ? 'fas' : 'far'} fa-heart"></i>
                        ${isInFavorites ? 'В избранном' : 'В избранное'}
                    </button>
                </div>
                
                <div class="modal-features">
                    <div class="feature-item">
                        <i class="fas fa-truck"></i>
                        <span>Бесплатная доставка от 5000₽</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>Гарантия подлинности 100%</span>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-undo"></i>
                        <span>Возврат в течение 14 дней</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.getElementById('overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('overlay').classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ===== УПРАВЛЕНИЕ ПОПАПАМИ =====
function openCartPopup() {
    document.getElementById('cartPopup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    updateCartPopup();
}

function closeCartPopup() {
    document.getElementById('cartPopup').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openFavoritesPopup() {
    document.getElementById('favoritesPopup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
    updateFavoritesPopup();
}

function closeFavoritesPopup() {
    document.getElementById('favoritesPopup').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openFilterPopup() {
    document.getElementById('filterPopup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeFilterPopup() {
    document.getElementById('filterPopup').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ===== УТИЛИТЫ =====
function getCategoryName(category) {
    const categories = {
        arabian: 'Арабские духи',
        premium: 'Премиум коллекция',
        affordable: 'Доступные духи',
        new: 'Новинки',
        sale: 'Акции'
    };
    return categories[category] || category;
}

function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-circle';
    if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(30, 30, 46, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 16px 24px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function initEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterProducts();
            }
        });
        
        searchInput.addEventListener('input', function() {
            // Если поле пустое, показываем все товары
            if (this.value.trim() === '') {
                filteredProducts = [...allProducts];
                currentPage = 1;
                renderProducts();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            if (searchInput.value.trim() !== '') {
                filterProducts();
            }
        });
    }
    
    // Сортировка
    document.getElementById('sortBy').addEventListener('change', filterProducts);
    
    // Профиль
    document.getElementById('userBtn')?.addEventListener('click', function() {
        showNotification(`Привет, ${user.firstName}! Профиль в разработке.`, 'info');
    });
    
    // Нижнее меню
    document.getElementById('navFavorites')?.addEventListener('click', openFavoritesPopup);
    document.getElementById('navCart')?.addEventListener('click', openCartPopup);
    document.getElementById('navFilter')?.addEventListener('click', openFilterPopup);
    
    // Кнопка "Перейти в каталог" в пустом избранном
    document.getElementById('browseBtn')?.addEventListener('click', function() {
        closeFavoritesPopup();
        resetFilters();
    });
    
    // Закрытие попапов
    document.getElementById('closeCart')?.addEventListener('click', closeCartPopup);
    document.getElementById('closeFav')?.addEventListener('click', closeFavoritesPopup);
    document.getElementById('closeFilter')?.addEventListener('click', closeFilterPopup);
    document.getElementById('closeModal')?.addEventListener('click', closeProductModal);
    
    // Оверлей для закрытия попапов
    document.getElementById('overlay')?.addEventListener('click', function() {
        closeCartPopup();
        closeFavoritesPopup();
        closeFilterPopup();
        closeProductModal();
    });
    
    // Оформление заказа
    document.getElementById('checkoutBtn')?.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Добавьте товары в корзину', 'info');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderItems = cart.map(item => 
            `${item.name} - ${item.quantity} × ${item.price.toLocaleString()}₽ = ${(item.price * item.quantity).toLocaleString()}₽`
        ).join('\n');
        
        const orderText = `
🎁 *Новый заказ в Aura Atelier*

📦 *Товары:*
${orderItems}

💰 *Итого:* ${total.toLocaleString()}₽
📅 *Дата:* ${new Date().toLocaleString('ru-RU')}
        `.trim();
        
        // Если в Telegram, отправляем через WebApp
        if (tg.sendData) {
            const orderData = {
                userId: user.id,
                username: user.username,
                items: cart,
                total: total,
                timestamp: new Date().toISOString()
            };
            
            tg.sendData(JSON.stringify(orderData));
            tg.showAlert(`Заказ оформлен!\n\nСумма: ${total.toLocaleString()}₽\nТоваров: ${cart.length}\n\nС вами свяжется менеджер для подтверждения.`);
        } else {
            // Вне Telegram - открываем ссылку с предзаполненным сообщением
            const telegramUrl = `https://t.me/Ayder505?text=${encodeURIComponent(orderText)}`;
            window.open(telegramUrl, '_blank');
            showNotification(`Заказ на ${total.toLocaleString()}₽ отправлен менеджеру`, 'success');
        }
        
        // Очищаем корзину
        cart = [];
        saveToStorage(STORAGE_KEYS.CART, cart);
        updateCartCount();
        updateCartPopup();
        renderProducts();
        
        closeCartPopup();
    });
    
    // Обработка кликов по страницам
    document.querySelectorAll('.page-btn').forEach(btn => {
        if (btn.dataset.page) {
            btn.addEventListener('click', function() {
                goToPage(parseInt(this.dataset.page));
            });
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartPopup();
            closeFavoritesPopup();
            closeFilterPopup();
            closeProductModal();
        }
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
// Добавляем стили для анимаций
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .modal-product {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    @media (min-width: 768px) {
        .modal-product {
            grid-template-columns: 1fr 1fr;
        }
    }
    
    .modal-product-images {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .modal-main-image {
        width: 100%;
        height: 300px;
        object-fit: contain;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 20px;
    }
    
    .modal-thumbnails {
        display: flex;
        gap: 10px;
    }
    
    .modal-thumbnail {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 12px;
        cursor: pointer;
        border: 2px solid transparent;
    }
    
    .modal-thumbnail.active {
        border-color: var(--color-primary);
    }
    
    .modal-product-info {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .modal-product-title {
        font-size: 1.8rem;
        color: var(--color-text);
        margin-bottom: 10px;
        line-height: 1.3;
    }
    
    .modal-product-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        color: var(--color-text-secondary);
        margin-bottom: 20px;
        align-items: center;
    }
    
    .modal-description h3,
    .modal-notes h3 {
        margin-bottom: 10px;
        color: var(--color-text);
        font-size: 1.1rem;
    }
    
    .notes-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
    }
    
    .note-tag {
        background: rgba(138, 43, 226, 0.2);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        color: var(--color-primary-light);
        border: 1px solid rgba(138, 43, 226, 0.3);
    }
    
    .modal-prices {
        margin: 20px 0;
    }
    
    .modal-price-current {
        font-size: 2.2rem;
        font-weight: 800;
        color: var(--color-text);
        margin-bottom: 10px;
    }
    
    .modal-price-old {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--color-text-muted);
        text-decoration: line-through;
        font-size: 1.1rem;
    }
    
    .modal-discount {
        background: linear-gradient(135deg, var(--color-accent), #FF3860);
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 0.9rem;
    }
    
    .modal-actions {
        display: flex;
        gap: 10px;
        margin: 20px 0;
    }
    
    .modal-btn-cart,
    .modal-btn-fav {
        flex: 1;
        padding: 16px;
        border-radius: 16px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s ease;
        font-size: 1rem;
    }
    
    .modal-btn-cart {
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
        color: white;
    }
    
    .modal-btn-cart:hover {
        background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(138, 43, 226, 0.4);
    }
    
    .modal-btn-cart.in-cart {
        background: linear-gradient(135deg, var(--color-success), #00A86B);
    }
    
    .modal-btn-cart.in-cart:hover {
        background: linear-gradient(135deg, #00D68F, var(--color-success));
    }
    
    .modal-btn-fav {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: var(--color-text);
    }
    
    .modal-btn-fav:hover,
    .modal-btn-fav.active {
        background: linear-gradient(135deg, var(--color-accent), #FF3860);
        color: white;
        border-color: var(--color-accent);
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(255, 107, 139, 0.4);
    }
    
    .modal-features {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--color-text-secondary);
        font-size: 0.95rem;
    }
    
    .feature-item i {
        color: var(--color-primary-light);
        font-size: 1.1rem;
    }
`;
document.head.appendChild(animationStyles);

// ===== ГЛОБАЛЬНЫЙ ЭКСПОРТ ДЛЯ ОТЛАДКИ =====
window.app = {
    user,
    allProducts,
    cart,
    favorites,
    filteredProducts,
    filterProducts,
    toggleCart,
    toggleFavorite,
    showProductModal,
    closeProductModal,
    resetFilters,
    openCartPopup,
    openFavoritesPopup,
    openFilterPopup
};

console.log('Aura Atelier приложение инициализировано');