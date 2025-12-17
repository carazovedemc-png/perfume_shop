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
let deliveryAddress = '';
let isAddressSaved = false;

// Ключи для localStorage
const STORAGE_KEYS = {
    CART: 'aura_atelier_cart',
    FAVORITES: 'aura_atelier_favorites',
    USER: 'aura_atelier_user',
    ADDRESS: 'aura_atelier_address'
};

// КАРТОЧКИ ТОВАРОВ
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Aris 222 VIP Bleck",
        description: "доставка по Симферополю бесплатно",
        price: 350,
        oldPrice: 0,
        category: "arabian",
        volume: 6,
        rating: 4.8,
        reviews: 100,
        image: "https://images.satu.kz/227064425_w700_h500_maslyanye-duhi-al.jpg",
        badge: "null",
        inStock: true,
        popular: true,
        notes: ["лаванда", "чёрная ваниль", "мускус"]
    },
    {
        id: 2,
        name: "Dalal",
        description: "Доставка по Симферополю бесплатно.",
        price: 350,
        oldPrice: 0,
        category: "premium",
        volume: 6,
        rating: 4.9,
        reviews: 100,
        image: "https://sun9-41.userapi.com/s/v1/ig2/vkEyo2KDCGJhawzJ2PSYbdY9h4EOrh30HrjwefVSCbYOSqJPoXruX0WobRyxKbRBw8BvdlL8sejPGZ4p-RrVjUOO.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=m0AEgal8BacMT-TAXZva7xEf1ZAAdIa_7ZvmQJYgIsY&cs=360x0",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["апельсин", "карамель", "ваниль", "сандаловое дерево"]
    },
    {
        id: 3,
        name: "Black Opium",
        description: "Женские духи",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.6,
        reviews: 100,
        image: "https://sun9-43.userapi.com/s/v1/ig2/7OuPKSCxdwp7oHCuEccqLkHkK_-ovx6ks842VjcS4nIExZ1VGhdLfUhSz-ueglS4PgI_fh29HEvPqFLzNlKj3tej.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=DTS3NJnjcShlWzwIHzZ9tgVLIOKUx8JWVEEhGsoYZH0&cs=640x0",
        badge: "null",
        inStock: true,
        popular: false,
        notes: ["кофе", "жасмин", "ваниль", "кедр", "миндаль"]
    },
    {
        id: 4,
        name: "Creed Aventus For Her",
        description: "Limited Edition Creed Aventus For Her - женский аромат. Это фруктово шипровая парфюмерная вода с нотами зеленого яблока, лимона, бергамота, розы, сандала и мускуса",
        price: 350,
        oldPrice: 0,
        category: "premium",
        volume: 6,
        rating: 4.9,
        reviews: 167,
        image: "https://sun9-79.userapi.com/s/v1/ig2/XOkgSK57rv_tI2P2NE_TQ_5nKYuTRM_AUJfT2YQ53g0-5lW9ETR7FbZ4yRYeNTHIuBcNPhP4lKiON3Nwe1sMTy0S.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=L5LPBfopJzZuCDe9YN9SywE0Br_mxxQTJfwhp4lDlAI&cs=360x0",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["бергамот", "мускус", "роза", "лимон", "сандал", "зелёное яблоко"]
    },
    {
        id: 5,
        name: "Kirki Aksa",
        description: "Концентрированное эфирное масло Kirki Aksa - это унисекс парфюм с фруктово шипровым ароматом. Верхние ноты - Маракуйя персик, малина, лист черной смородины, груша, песок. Средние ноты - Ландыш. Базовые ноты - Гелиотроп, сандал, ваниль, пачули, мускус.",
        price: 350,
        oldPrice: 0,
        category: "premium",
        volume: 6,
        rating: 4.7,
        reviews: 187,
        image: "https://sun9-84.userapi.com/s/v1/ig2/LDMpV1ihJnWYPte5wGmG-BxwBsBptbz7QSARpRMRdZt-fpO0wy_4ZPiEPS0oWkLxjFPzRm1wdDYeA2n88xh7Fegn.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=QhV-dEoaJC83x6egk46Ej6FZETeNOMWtoQnFpIMrEII&cs=360x0",
        badge: "null",
        inStock: true,
        popular: true,
        notes: ["маракуйя", "персик", "ваниль"]
    },
    {
        id: 6,
        name: "Black Opium",
        description: "Это масляные духи с феромонами Black Opium — это женская парфюмерная вода",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.5,
        reviews: 92,
        image: "https://sun9-37.userapi.com/s/v1/ig2/sE51AVESqed4uV7s0G1BwL6YiNvoyG81xw3TEiygep-FuH_44Vl82QuVDfVZteIIdCAa1NAXQ2A-fQDnoOtisjq4.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=RXKCzPLanm6VtxbnzBnP-I3Ki7th8SeNxFq2aFmrLDE&cs=360x0",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["жасмин", "груша", "кофе"]
    },
    {
        id: 7,
        name: "YARAN Voux",
        description: "YARAN Voux от Aris Perfumes — это концентрированное парфюмерное масло (CPO). Это унисекс-аромат, который относится к восточным или гурманским коллекциям, схожим с другими ароматами от брендов, таких как Paris Corner.",
        price: 350,
        oldPrice: 0,
        category: "premium",
        volume: 6,
        rating: 4.8,
        reviews: 143,
        image: "https://sun9-18.userapi.com/s/v1/ig2/JPe8xzc_vL633B2Y0VenFoeipK_joP7GR9FZZ565Z7XEuh8CeoYJxM7GmBFilsfBbropmaZze7L5RJ5ISim-VNa8.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=DwhSt-8w64gm4QVZgK4wKRnie5o2V4HtkWzexyWhaos&cs=360x0",
        badge: "null",
        inStock: true,
        popular: true,
        notes: ["ваниль", "сандал", "мускус"]
    },
    {
        id: 8,
        name: "Al Rayan G&D Limperatrice",
        description: "Al Rayan G&D Limperatrice — это концентрированное масляное парфюмерное масло (аттар). Композиция аромата включает следующие ноты: Верхние ноты: Розовый перец, ревень, киви. Средние ноты (сердце): Арбуз, цикламен, жасмин. Базовые ноты: Мускус, сандал, лимонное (китайское) дерево. Описание Аромат описывается как яркий, игривый и энергичный, с доминирующими аккордами сочных тропических фруктов и свежестью. Он подходит для дневного ношения, особенно в весенне-летний период.",
        price: 350,
        oldPrice: 0,
        category: "arabian",
        volume: 6,
        rating: 4.6,
        reviews: 56,
        image: "https://sun9-32.userapi.com/s/v1/ig2/u7kV68pjiyC_Ep97GMc8IEBXIH5cX50pFb6q5MNe7wnyULSvSD4-xUH6qRePG96lG1aWbOChxMLH_QshKz3HP9Uj.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=lf3dVx7r5RsUdRttLycIgRe0gYshLVfBPnVAmBYt9_0&cs=360x0",
        badge: "new",
        inStock: true,
        popular: true,
        notes: ["ревень", "киви", "арбуз", "мускус"]
    },
    {
        id: 9,
        name: "Al-Rayan Kilian By In The City",
        description: "Представленный на изображении товар - это масляные духи Al-Rayan Kilian By In The City Верхние ноты - Бергамот, гватемальский кардамон и розовый перец. Ноты сердца - Абрикос, карамелизованная слива, турецкая роза и ладан. Базовые ноты: Кедр, индонезийский пачули.",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.4,
        reviews: 234,
        image: "https://sun9-6.userapi.com/s/v1/ig2/j3IQyd0QOc9sOzrhRtrqAih-tEG7x5xPiZMfCVxsQyVlb3HjvwSl6OAQK_7QVoRurh9X7w1zX0dEDG12-77JCtQs.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=ytxGprY0FWbTGBoY3EXaC9oX0EfZcJY43B7M6hNMe5g&cs=360x0",
        badge: "null",
        inStock: true,
        popular: true,
        notes: ["кедр", "абрикос", "розовый перец"]
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
    renderProducts();
    updateCartCount();
    updateFavoritesCount();
    setupFilterPopup();
    initEventListeners();
    loadAddress();
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

function loadAddress() {
    const savedAddress = loadFromStorage(STORAGE_KEYS.ADDRESS, '');
    if (savedAddress) {
        deliveryAddress = savedAddress;
        isAddressSaved = true;
        const addressInput = document.getElementById('deliveryAddress');
        if (addressInput) {
            addressInput.value = deliveryAddress;
        }
        updateAddressStatus();
    }
}

function saveAddress() {
    const addressInput = document.getElementById('deliveryAddress');
    if (addressInput) {
        deliveryAddress = addressInput.value.trim();
        if (deliveryAddress) {
            isAddressSaved = true;
            saveToStorage(STORAGE_KEYS.ADDRESS, deliveryAddress);
            updateAddressStatus();
            showNotification('Адрес сохранен', 'success');
            updateCheckoutButton();
            return true;
        } else {
            showNotification('Введите адрес доставки', 'warning');
            return false;
        }
    }
    return false;
}

function updateAddressStatus() {
    const addressStatus = document.getElementById('addressStatus');
    if (addressStatus) {
        if (isAddressSaved && deliveryAddress) {
            addressStatus.innerHTML = `<i class="fas fa-check-circle" style="color: var(--color-success);"></i> Адрес сохранен: ${deliveryAddress.substring(0, 30)}${deliveryAddress.length > 30 ? '...' : ''}`;
        } else {
            addressStatus.innerHTML = '<i class="fas fa-exclamation-circle" style="color: var(--color-warning);"></i> Адрес не указан';
        }
    }
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
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===== КОРЗИНА =====
function toggleCart(productId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Удаляем из корзины
        cart.splice(existingItemIndex, 1);
        showNotification(`${product.name} удален из корзины`, 'info');
    } else {
        // Добавляем в корзину
        cart.push({
            ...product,
            quantity: 1,
            selected: true, // По умолчанию товар выбран
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
    const topCartCount = document.getElementById('topCartCount');
    const bottomCartCount = document.getElementById('bottomCartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (topCartCount) {
        topCartCount.textContent = totalItems;
        topCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
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
    const selectAllCheckbox = document.getElementById('selectAllItems');
    
    if (!cartItems || !cartTotal || !cartFinal || !selectAllCheckbox) return;
    
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
        selectAllCheckbox.checked = false;
        selectAllCheckbox.disabled = true;
        return;
    }
    
    // Обновляем состояние "Выбрать все"
    const allSelected = cart.every(item => item.selected);
    const someSelected = cart.some(item => item.selected);
    selectAllCheckbox.checked = allSelected;
    selectAllCheckbox.indeterminate = !allSelected && someSelected;
    selectAllCheckbox.disabled = false;
    
    // Рендерим товары
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <label class="checkbox cart-item-checkbox">
                <input type="checkbox" class="cart-item-checkbox-input" data-id="${item.id}" ${item.selected ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
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
    
    // Добавляем обработчики для чекбоксов
    document.querySelectorAll('.cart-item-checkbox-input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const productId = parseInt(this.dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.selected = this.checked;
                saveToStorage(STORAGE_KEYS.CART, cart);
                updateCartSummary();
                updateSelectAllState();
            }
        });
    });
    
    // Обновляем суммы
    updateCartSummary();
    updateCheckoutButton();
}

function updateCartSummary() {
    const cartTotal = document.getElementById('cartTotal');
    const cartFinal = document.getElementById('cartFinal');
    
    // Считаем только выбранные товары
    const selectedItems = cart.filter(item => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = selectedItems.reduce((sum, item) => {
        if (item.oldPrice > 0) {
            return sum + ((item.oldPrice - item.price) * item.quantity);
        }
        return sum;
    }, 0);
    const total = subtotal - discount;
    
    cartTotal.textContent = `${subtotal.toLocaleString()} ₽`;
    cartFinal.textContent = `${total.toLocaleString()} ₽`;
}

function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('selectAllItems');
    if (!selectAllCheckbox) return;
    
    const allSelected = cart.every(item => item.selected);
    const someSelected = cart.some(item => item.selected);
    
    selectAllCheckbox.checked = allSelected;
    selectAllCheckbox.indeterminate = !allSelected && someSelected;
}

function selectAllCartItems(checked) {
    cart.forEach(item => {
        item.selected = checked;
    });
    saveToStorage(STORAGE_KEYS.CART, cart);
    updateCartPopup();
    renderProducts();
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

function updateCheckoutButton() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;
    
    const selectedItems = cart.filter(item => item.selected);
    const hasSelectedItems = selectedItems.length > 0;
    
    if (!isAddressSaved || !deliveryAddress) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.6';
        checkoutBtn.style.cursor = 'not-allowed';
    } else if (!hasSelectedItems) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.6';
        checkoutBtn.style.cursor = 'not-allowed';
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
    }
}

// ===== ИЗБРАННОЕ =====
function toggleFavorite(productId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
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
            const isInCart = cart.some(item => item.id === product.id);
            const item = document.createElement('div');
            item.className = 'cart-item';
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${product.name}</h4>
                    <div class="cart-item-price">${product.price.toLocaleString()} ₽</div>
                    <div class="cart-item-controls">
                        <button class="btn-cart" onclick="toggleCart(${product.id}, event)" style="padding: 8px 12px; font-size: 0.8rem;">
                            ${isInCart ? '<i class="fas fa-check"></i> В корзине' : '<i class="fas fa-shopping-cart"></i> В корзину'}
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

// ===== МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ ТОВАРА =====
function setupProductCardClick() {
    // Используем делегирование событий
    document.addEventListener('click', function(event) {
        const target = event.target;
        const productCard = target.closest('.product-card');
        
        if (productCard) {
            // Проверяем, не кликнули ли по кнопкам внутри карточки
            if (!target.closest('.btn-cart') && !target.closest('.btn-fav')) {
                const productId = parseInt(productCard.dataset.id);
                const product = allProducts.find(p => p.id === productId);
                if (product) {
                    showProductModal(product);
                }
            }
        }
    });
}

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
                <img src="${product.image}" alt="${product.name}" class="modal-main-image" style="width: 100%; max-height: 300px; object-fit: contain; border-radius: var(--radius-md);">
            </div>
            <div class="modal-product-info">
                <div class="modal-badges">
                    ${product.badge === 'new' ? '<span class="badge-new">Новинка</span>' : ''}
                    ${product.badge === 'sale' ? '<span class="badge-sale">Скидка</span>' : ''}
                    ${product.badge === 'hit' ? '<span class="badge-hit">Хит</span>' : ''}
                </div>
                <h2 class="modal-product-title" style="font-size: 1.5rem; margin: 10px 0;">${product.name}</h2>
                <div class="modal-product-meta" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                    <span class="modal-category" style="background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 20px;">${getCategoryName(product.category)}</span>
                    <span class="modal-volume" style="background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 20px;">${product.volume} мл</span>
                    <div class="modal-rating" style="display: flex; align-items: center; gap: 5px;">
                        ${renderStars(product.rating)}
                        <span>${product.rating} (${product.reviews} отзывов)</span>
                    </div>
                </div>
                
                <div class="modal-description" style="margin-bottom: 20px;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 10px;">Описание</h3>
                    <p style="color: var(--color-text-secondary); line-height: 1.5;">${product.description}</p>
                </div>
                
                ${product.notes && product.notes.length > 0 ? `
                <div class="modal-notes" style="margin-bottom: 20px;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 10px;">Ноты аромата</h3>
                    <div class="notes-tags" style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${product.notes.map(note => `<span class="note-tag" style="background: rgba(138,43,226,0.2); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem;">${note}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="modal-prices" style="margin-bottom: 20px;">
                    <div class="modal-price-current" style="font-size: 2rem; font-weight: 700; color: var(--color-text);">
                        ${product.price.toLocaleString()} ₽
                    </div>
                    ${product.oldPrice > 0 ? `
                        <div class="modal-price-old" style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                            <span style="color: var(--color-text-muted); text-decoration: line-through;">${product.oldPrice.toLocaleString()} ₽</span>
                            <span class="modal-discount" style="background: var(--color-sale); color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.85rem; font-weight: 700;">-${discountPercent}%</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="modal-actions" style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button class="modal-btn-cart ${isInCart ? 'in-cart' : ''}" onclick="toggleCart(${product.id})" style="flex: 1; padding: 15px; background: ${isInCart ? 'var(--color-success)' : 'var(--color-primary)'}; color: white; border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer;">
                        ${isInCart ? '<i class="fas fa-check"></i> В корзине' : '<i class="fas fa-shopping-cart"></i> В корзину'}
                    </button>
                    <button class="modal-btn-fav ${isInFavorites ? 'active' : ''}" onclick="toggleFavorite(${product.id})" style="width: 60px; background: ${isInFavorites ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}; color: white; border: none; border-radius: var(--radius-md); cursor: pointer;">
                        <i class="${isInFavorites ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                
                <div class="modal-features" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <i class="fas fa-truck" style="color: var(--color-primary);"></i>
                        <span>Бесплатная доставка по Симферополю</span>
                    </div>
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <i class="fas fa-shield-alt" style="color: var(--color-primary);"></i>
                        <span>Гарантия подлинности 100%</span>
                    </div>
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-award" style="color: var(--color-primary);"></i>
                        <span>Эксклюзивная парфюмерия</span>
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
    updateCheckoutButton();
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
    // Удаляем предыдущие уведомления
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
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
    
    // Анимации
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
    
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
        
        // Убираем input listener чтобы не лагало
        searchInput.addEventListener('input', function() {
            // Используем debounce для предотвращения лагов
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                if (this.value.trim() === '') {
                    filteredProducts = [...allProducts];
                    currentPage = 1;
                    renderProducts();
                }
            }, 300);
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
    
    // Нижнее меню
    document.getElementById('navFavorites')?.addEventListener('click', openFavoritesPopup);
    document.getElementById('navCart')?.addEventListener('click', openCartPopup);
    document.getElementById('navFilter')?.addEventListener('click', openFilterPopup);
    
    // Кнопка "Выбрать все" в корзине
    document.getElementById('selectAllItems')?.addEventListener('change', function() {
        selectAllCartItems(this.checked);
    });
    
    // Сохранение адреса
    document.getElementById('saveAddressBtn')?.addEventListener('click', function() {
        if (saveAddress()) {
            updateCheckoutButton();
        }
    });
    
    // Ввод адреса по Enter
    document.getElementById('deliveryAddress')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (saveAddress()) {
                updateCheckoutButton();
            }
        }
    });
    
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
        
        // Проверяем выбранные товары
        const selectedItems = cart.filter(item => item.selected);
        if (selectedItems.length === 0) {
            showNotification('Выберите товары для заказа', 'info');
            return;
        }
        
        // Проверяем адрес доставки
        if (!isAddressSaved || !deliveryAddress) {
            showNotification('Сначала укажите адрес доставки', 'warning');
            
            // Эффект тряски кнопки
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
            
            // Фокус на поле адреса
            const addressInput = document.getElementById('deliveryAddress');
            if (addressInput) {
                addressInput.focus();
            }
            return;
        }
        
        const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderItems = selectedItems.map(item => 
            `${item.name} - ${item.quantity} × ${item.price.toLocaleString()}₽ = ${(item.price * item.quantity).toLocaleString()}₽`
        ).join('\n');
        
        const orderText = `
📨 **Новый заказ в Aura Atelier**

👤 **Покупатель:** ${user.firstName} ${user.lastName}
📱 **Username:** @${user.username}

📦 **Товары:**
${orderItems}

🧾 **Итого:** ${total.toLocaleString()}₽
📍 **Адрес доставки:** ${deliveryAddress}
📅 **Дата:** ${new Date().toLocaleString('ru-RU')}

💬 **Связь:** @Ayder505, @Ma1traher
        `.trim();
        
        // Если в Telegram, отправляем через WebApp
        if (tg.sendData) {
            const orderData = {
                userId: user.id,
                username: user.username,
                items: selectedItems,
                total: total,
                deliveryAddress: deliveryAddress,
                timestamp: new Date().toISOString()
            };
            
            tg.sendData(JSON.stringify(orderData));
            tg.showAlert(`Заказ оформлен!\n\nСумма: ${total.toLocaleString()}₽\nТоваров: ${selectedItems.length}\nАдрес: ${deliveryAddress}\n\nС вами свяжется менеджер для подтверждения.`);
        } else {
            // Вне Telegram - открываем ссылку с предзаполненным сообщением
            const telegramUrl = `https://t.me/Ayder505?text=${encodeURIComponent(orderText)}`;
            window.open(telegramUrl, '_blank');
            showNotification(`Заказ на ${total.toLocaleString()}₽ отправлен менеджеру`, 'success');
        }
        
        // Удаляем только выбранные товары из корзины
        cart = cart.filter(item => !item.selected);
        saveToStorage(STORAGE_KEYS.CART, cart);
        updateCartCount();
        updateCartPopup();
        renderProducts();
        
        closeCartPopup();
    });
    
    // Обработка кликов по кнопкам в карточках товаров (делегирование)
    document.addEventListener('click', function(event) {
        const target = event.target;
        
        // Клик по кнопке "В корзину" на карточке товара
        const cartBtn = target.closest('.btn-cart');
        if (cartBtn) {
            event.stopPropagation();
            event.preventDefault();
            const productId = parseInt(cartBtn.dataset.id);
            if (productId) {
                toggleCart(productId, event);
            }
            return;
        }
        
        // Клик по кнопке "Избранное" на карточке товара
        const favBtn = target.closest('.btn-fav');
        if (favBtn) {
            event.stopPropagation();
            event.preventDefault();
            const productId = parseInt(favBtn.dataset.id);
            if (productId) {
                toggleFavorite(productId, event);
            }
            return;
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
    
    // Инициализация клика по карточкам товаров
    setupProductCardClick();
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
// Убедимся что DOM загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
} else {
    initEventListeners();
}

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
    openFilterPopup,
    selectAllCartItems,
    saveAddress,
    deliveryAddress
};

console.log('Aura Atelier приложение инициализировано');