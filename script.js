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

    // КАРТОЧКИ ТОВАРОВ
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Aris 222 VIP Bleck",
        description: "доставка по Симферополю бесплатно",
        price: 350,
        oldPrice: 500,
        category: "arabian",
        volume: 100,
        rating: 4.8,
        reviews: 100,
        image: "https://images.satu.kz/227064425_w700_h500_maslyanye-duhi-al.jpg",
        badge: "sale",
        inStock: true,
        popular: true,
        notes: ["ладан", "кожа", "специи"]
    },
    {
        id: 2,
        name: "Dalal",
        description: "Доставка по Симферополю бесплатно.",
        price: 350,
        oldPrice: 0,
        category: "premium",
        volume: 100,
        rating: 4.9,
        reviews: 100,
        image: "https://sun9-41.userapi.com/s/v1/ig2/vkEyo2KDCGJhawzJ2PSYbdY9h4EOrh30HrjwefVSCbYOSqJPoXruX0WobRyxKbRBw8BvdlL8sejPGZ4p-RrVjUOO.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=m0AEgal8BacMT-TAXZva7xEf1ZAAdIa_7ZvmQJYgIsY&cs=360x0",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["апельсин", "карамель", "ваниль","сандаловое дерево"]
    },
    {
        id: 3,
        name: "Black Opium",
        description: "доставка по Симферополю бесплатно",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 100,
        rating: 4.6,
        reviews: 100,
        image: "https://sun9-43.userapi.com/s/v1/ig2/7OuPKSCxdwp7oHCuEccqLkHkK_-ovx6ks842VjcS4nIExZ1VGhdLfUhSz-ueglS4PgI_fh29HEvPqFLzNlKj3tej.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=DTS3NJnjcShlWzwIHzZ9tgVLIOKUx8JWVEEhGsoYZH0&cs=640x0",
        badge: "null",
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
    },
// ... существующие товары 1-12

{
    id: 13,  // УВЕЛИЧЬ ID на 1
    name: "ТВОЙ НОВЫЙ ТОВАР",
    description: "Описание",
    price: 5000,
    oldPrice: 0,  // если нет старой цены - оставь 0
    category: "arabian",  // или "premium", "affordable"
    volume: 100,
    rating: 4.5,
    reviews: 0,
    image: "ССЫЛКА_НА_КАРТИНКУ.jpg",
    badge: null,  // или "new", "sale", "hit"
    inStock: true,
    popular: false,
    notes: ["нота1", "нота", "нота3"]
},  // <- ЗАПЯТАЯ ЗДЕСЬ ОБЯЗАТЕЛЬНО!

];  // закрывающая скобка массива

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
                <button class="btn-cart ${isInCart ? 'in-cart' : ''}" data-id="${product.id}">
                    ${isInCart ? '<i class="fas fa-check"></i> В корзине' : '<i class="fas fa-shopping-cart"></i> В корзину'}
                </button>
                <button class="btn-fav ${isInFavorites ? 'active' : ''}" data-id="${product.id}">
                    <i class="${isInFavorites ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    updatePagination();
    setupProductClickHandlers(); // Добавляем обработчики после рендеринга
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

// ===== ОБРАБОТЧИКИ КЛИКОВ ПО КАРТОЧКАМ =====
function setupProductClickHandlers() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    // Используем делегирование событий
    grid.addEventListener('click', function(event) {
        const target = event.target;
        
        // Клик по кнопке "В корзину"
        const cartBtn = target.closest('.btn-cart');
        if (cartBtn) {
            event.stopPropagation();
            const productId = parseInt(cartBtn.dataset.id);
            toggleCart(productId, event);
            return;
        }
        
        // Клик по кнопке "Избранное"
        const favBtn = target.closest('.btn-fav');
        if (favBtn) {
            event.stopPropagation();
            const productId = parseInt(favBtn.dataset.id);
            toggleFavorite(productId, event);
            return;
        }
        
        // Клик по карточке товара (но не по кнопкам)
        const productCard = target.closest('.product-card');
        if (productCard && 
            !target.closest('.btn-cart') && 
            !target.closest('.btn-fav') &&
            !target.closest('.product-badges')) {
            
            const productId = parseInt(productCard.dataset.id);
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                showProductDetailsModal(product);
            }
        }
    });
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