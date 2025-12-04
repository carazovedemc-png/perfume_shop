// ===== КОНФИГУРАЦИЯ И ИНИЦИАЛИЗАЦИЯ =====
const tg = window.Telegram.WebApp;
let user = null;
let perfumes = [];
let adminList = ['@your_username']; // Замените на ваш юзернейм
let isAdmin = false;

// Примеры духов для демонстрации
const samplePerfumes = [
    {
        id: 1,
        name: "Amouage Interlude",
        description: "Эксклюзивный арабский парфюм с нотами ладана, кожи и специй. Создан для истинных ценителей роскоши.",
        price: 28500,
        oldPrice: 32000,
        category: "arabian",
        volume: 100,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        badge: "Эксклюзив"
    },
    {
        id: 2,
        name: "Chanel №5 L'EAU",
        description: "Современная интерпретация классики. Лёгкий, свежий цветочный аромат с цитрусовыми нотами.",
        price: 8900,
        oldPrice: 10500,
        category: "premium",
        volume: 100,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        badge: "Бестселлер"
    },
    {
        id: 3,
        name: "Zara Tobacco Collection",
        description: "Современный доступный аромат с нотами табака, ванили и древесины. Идеальный выбор на каждый день.",
        price: 1999,
        oldPrice: 2499,
        category: "affordable",
        volume: 100,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1590736969956-6d9c2a8d6971?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        badge: "Хит продаж"
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
        image: "https://images.unsplash.com/photo-1590736969956-6d9c2a8d6971?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        badge: "Лимитированная серия"
    },
    {
        id: 5,
        name: "Jo Malone Wood Sage",
        description: "Уникальный аромат с нотами шалфея, морской соли и древесины. Свежий и естественный.",
        price: 12500,
        oldPrice: 14500,
        category: "premium",
        volume: 100,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        badge: "Новинка"
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
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        badge: "Популярный"
    }
];

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initTelegramApp();
    initEventListeners();
    loadPerfumes();
    updateUserInterface();
});

// ===== ОСНОВНЫЕ ФУНКЦИИ =====
function initTelegramApp() {
    if (tg.initDataUnsafe?.user) {
        user = {
            id: tg.initDataUnsafe.user.id,
            username: tg.initDataUnsafe.user.username || `user_${tg.initDataUnsafe.user.id}`,
            firstName: tg.initDataUnsafe.user.first_name,
            lastName: tg.initDataUnsafe.user.last_name
        };
        
        tg.expand();
        tg.setHeaderColor('#111118');
        tg.setBackgroundColor('#0a0a0f');
        
        console.log('Пользователь Telegram:', user);
    } else {
        user = {
            id: 1,
            username: 'demo_user',
            firstName: 'Демо',
            lastName: 'Пользователь'
        };
        console.log('Режим демо (вне Telegram)');
    }
    
    checkAdminStatus();
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
    const mainActions = document.querySelector('.main-actions');
    
    const adminBtn = document.createElement('div');
    adminBtn.className = 'action-btn glass-card';
    adminBtn.id = 'adminBtn';
    adminBtn.innerHTML = `
        <div class="action-icon">
            <i class="fas fa-crown"></i>
        </div>
        <h3>Админ-панель</h3>
        <p>Управление каталогом и заказами</p>
    `;
    
    adminBtn.addEventListener('click', function() {
        window.location.href = 'admin.html';
    });
    
    mainActions.appendChild(adminBtn);
}

function initEventListeners() {
    // Кнопки главного меню
    document.getElementById('catalogBtn').addEventListener('click', showCatalog);
    document.getElementById('filtersBtn').addEventListener('click', showAdvancedFilters);
    document.getElementById('ordersBtn').addEventListener('click', showOrders);
    
    // Кнопки закрытия
    document.getElementById('closeCatalog').addEventListener('click', hideCatalog);
    document.getElementById('closeModal').addEventListener('click', hideModal);
    
    // Кнопка заказа
    document.getElementById('orderBtn').addEventListener('click', placeOrder);
    
    // Фильтры
    document.getElementById('categoryFilter').addEventListener('change', filterPerfumes);
    document.getElementById('priceFilter').addEventListener('change', filterPerfumes);
    document.getElementById('sortFilter').addEventListener('change', filterPerfumes);
    
    // Клик по оверлею модального окна
    document.getElementById('productModal').addEventListener('click', function(event) {
        if (event.target === this) {
            hideModal();
        }
    });
    
    // Аватар пользователя
    document.getElementById('userAvatar').addEventListener('click', showUserMenu);
}

function loadPerfumes() {
    perfumes = [...samplePerfumes];
    displayPerfumes(perfumes);
}

function displayPerfumes(perfumesList) {
    const grid = document.getElementById('perfumesGrid');
    grid.innerHTML = '';
    
    if (perfumesList.length === 0) {
        grid.innerHTML = `
            <div class="empty-state glass-card" style="grid-column: 1/-1; padding: 60px 20px; text-align: center;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--color-text-muted); margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 10px;">Ничего не найдено</h3>
                <p>Попробуйте изменить параметры фильтра</p>
            </div>
        `;
        return;
    }
    
    perfumesList.forEach((perfume, index) => {
        const card = document.createElement('div');
        card.className = 'perfume-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${perfume.image}" alt="${perfume.name}" class="card-image">
                <span class="card-badge">${perfume.badge}</span>
            </div>
            <div class="card-content">
                <h3 class="card-title">${perfume.name}</h3>
                <p class="card-description">${perfume.description}</p>
                <div class="card-footer">
                    <div class="price">${perfume.price.toLocaleString()}₽</div>
                    <div class="rating">
                        <i class="fas fa-star"></i> ${perfume.rating}
                    </div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => showProductModal(perfume));
        grid.appendChild(card);
    });
}

function getCategoryName(category) {
    const categories = {
        arabian: 'Арабские духи',
        premium: 'Премиум',
        affordable: 'Доступные',
        new: 'Новинки',
        bestseller: 'Бестселлеры'
    };
    return categories[category] || category;
}

// ===== УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ =====
function showCatalog() {
    document.getElementById('catalogContainer').style.display = 'block';
    document.querySelector('.hero-section').style.display = 'none';
    document.querySelector('.main-actions').style.display = 'none';
    
    // Прокрутка к каталогу
    document.getElementById('catalogContainer').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function hideCatalog() {
    document.getElementById('catalogContainer').style.display = 'none';
    document.querySelector('.hero-section').style.display = 'block';
    document.querySelector('.main-actions').style.display = 'grid';
    
    // Прокрутка к началу
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showProductModal(perfume) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const description = document.getElementById('modalDescription');
    const price = document.getElementById('modalPrice');
    const oldPrice = document.getElementById('modalOldPrice');
    const category = document.getElementById('modalCategory');
    const rating = document.getElementById('modalRating');
    const volume = document.getElementById('modalVolume');
    const image = document.getElementById('modalImage');
    const badge = document.getElementById('modalBadge');
    
    title.textContent = perfume.name;
    description.textContent = perfume.description;
    price.textContent = `${perfume.price.toLocaleString()} ₽`;
    category.textContent = getCategoryName(perfume.category);
    rating.textContent = perfume.rating;
    volume.textContent = perfume.volume;
    image.src = perfume.image;
    image.alt = perfume.name;
    badge.textContent = perfume.badge;
    
    if (perfume.oldPrice && perfume.oldPrice > perfume.price) {
        oldPrice.textContent = `${perfume.oldPrice.toLocaleString()} ₽`;
        oldPrice.style.display = 'inline';
    } else {
        oldPrice.style.display = 'none';
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function filterPerfumes() {
    const category = document.getElementById('categoryFilter').value;
    const price = document.getElementById('priceFilter').value;
    const sort = document.getElementById('sortFilter').value;
    
    let filtered = [...perfumes];
    
    // Фильтрация по категории
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Фильтрация по цене
    if (price !== 'all') {
        switch(price) {
            case 'low':
                filtered = filtered.filter(p => p.price < 3000);
                break;
            case 'medium':
                filtered = filtered.filter(p => p.price >= 3000 && p.price <= 10000);
                break;
            case 'high':
                filtered = filtered.filter(p => p.price > 10000 && p.price <= 25000);
                break;
            case 'luxury':
                filtered = filtered.filter(p => p.price > 25000);
                break;
        }
    }
    
    // Сортировка
    switch(sort) {
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
        default:
            filtered.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    displayPerfumes(filtered);
}

function placeOrder() {
    const perfumeName = document.getElementById('modalTitle').textContent;
    const price = document.getElementById('modalPrice').textContent;
    
    const orderData = {
        user: user.username,
        userId: user.id,
        perfume: perfumeName,
        price: price,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // В реальном приложении здесь был бы fetch на сервер
    console.log('Заказ создан:', orderData);
    
    // Отправка данных в Telegram
    if (tg.sendData) {
        tg.sendData(JSON.stringify(orderData));
    }
    
    // Показать уведомление
    tg.showAlert(`Заказ оформлен!\n\n${perfumeName}\n${price}\n\nС вами свяжется наш менеджер для подтверждения.`);
    
    hideModal();
}

function showAdvancedFilters() {
    tg.showAlert('Расширенные фильтры:\n\n• По нотам (цветочные, древесные, восточные)\n• По полу (мужские, женские, унисекс)\n• По сезону (летние, зимние, всесезонные)\n\nЭта функция будет доступна в следующем обновлении!');
}

function showOrders() {
    const orders = [
        { id: 1, name: 'Chanel №5', date: '15.03.2024', status: 'Доставлен', price: '8 900₽' },
        { id: 2, name: 'Zara Tobacco', date: '10.03.2024', status: 'В пути', price: '1 999₽' }
    ];
    
    let message = '🛍️ **Ваши заказы:**\n\n';
    
    if (orders.length === 0) {
        message += 'У вас пока нет заказов.\nПерейдите в каталог, чтобы сделать первый заказ!';
    } else {
        orders.forEach(order => {
            message += `📦 **${order.name}**\n`;
            message += `📅 ${order.date} | ${order.status}\n`;
            message += `💰 ${order.price}\n\n`;
        });
    }
    
    tg.showAlert(message);
}

function showUserMenu() {
    const menuItems = [
        `👤 **${user.firstName} ${user.lastName || ''}**`,
        `@${user.username}`,
        '',
        isAdmin ? '👑 Администратор' : '👤 Пользователь',
        '',
        '⚙️ Настройки',
        '📞 Поддержка',
        '🚪 Выйти'
    ];
    
    tg.showAlert(menuItems.join('\n'));
}

function updateUserInterface() {
    // Обновляем аватар пользователя
    const userAvatar = document.getElementById('userAvatar');
    if (user.firstName) {
        userAvatar.innerHTML = `<span>${user.firstName.charAt(0)}</span>`;
    }
}

// ===== ГЛОБАЛЬНЫЙ ЭКСПОРТ ДЛЯ ОТЛАДКИ =====
window.app = {
    user,
    perfumes,
    isAdmin,
    showCatalog,
    hideCatalog,
    filterPerfumes,
    showProductModal,
    hideModal
};

console.log('Parfume WebApp инициализирован');