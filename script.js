// Telegram WebApp инициализация
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран
tg.setHeaderColor('#764ba2');
tg.setBackgroundColor('#667eea');

let user = null;
let perfumes = [];
let adminList = ['@ваш_username']; // Ваш юзернейм в Telegram

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Получаем данные пользователя из Telegram
    if (tg.initDataUnsafe?.user) {
        user = {
            id: tg.initDataUnsafe.user.id,
            username: tg.initDataUnsafe.user.username,
            firstName: tg.initDataUnsafe.user.first_name
        };
        
        // Проверяем админские права
        checkAdminStatus();
        
        // Загружаем данные
        loadPerfumes();
    } else {
        // Для тестирования вне Telegram
        user = { id: 1, username: 'test_user', firstName: 'Тестовый' };
        loadPerfumes();
    }
    
    // Обработчики событий
    document.getElementById('catalogBtn').addEventListener('click', showCatalog);
    document.getElementById('closeCatalog').addEventListener('click', hideCatalog);
    document.getElementById('filtersBtn').addEventListener('click', showFilters);
    document.getElementById('ordersBtn').addEventListener('click', showOrders);
    document.getElementById('closeModal').addEventListener('click', hideModal);
    document.getElementById('orderBtn').addEventListener('click', placeOrder);
    document.getElementById('categoryFilter').addEventListener('change', filterPerfumes);
    document.getElementById('priceFilter').addEventListener('change', filterPerfumes);
    
    // Проверяем, если пользователь администратор
    function checkAdminStatus() {
        const isAdmin = adminList.includes(`@${user.username}`);
        if (isAdmin) {
            showAdminFeatures();
        }
    }
    
    // Показываем админ-функции
    function showAdminFeatures() {
        const actions = document.querySelector('.actions');
        const adminBtn = document.createElement('button');
        adminBtn.className = 'btn-secondary';
        adminBtn.innerHTML = '<i class="fas fa-cog"></i> Админ-панель';
        adminBtn.addEventListener('click', showAdminPanel);
        actions.appendChild(adminBtn);
    }
    
    // Загружаем духи из "базы данных"
    function loadPerfumes() {
        // Временные данные для демонстрации
        perfumes = [
            {
                id: 1,
                name: "Amouage Interlude",
                description: "Эксклюзивный арабский парфюм с нотами ладана и кожи",
                price: 25000,
                category: "arabian",
                image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
                rating: 4.8
            },
            {
                id: 2,
                name: "Chanel №5",
                description: "Классический французский аромат с цветочными нотами",
                price: 8500,
                category: "premium",
                image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w-400",
                rating: 4.9
            },
            {
                id: 3,
                name: "Zara Tobacco",
                description: "Современный доступный аромат с табачными акцентами",
                price: 1999,
                category: "affordable",
                image: "https://images.unsplash.com/photo-1590736969956-6d9c2a8d6971?w=400",
                rating: 4.3
            },
            {
                id: 4,
                name: "Oud Ispahan",
                description: "Роскошный арабский уд с древесными нотами",
                price: 32000,
                category: "arabian",
                image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
                rating: 4.9
            }
        ];
        
        displayPerfumes(perfumes);
    }
    
    // Отображаем духи в каталоге
    function displayPerfumes(perfumesList) {
        const grid = document.getElementById('perfumesGrid');
        grid.innerHTML = '';
        
        perfumesList.forEach(perfume => {
            const card = document.createElement('div');
            card.className = 'perfume-card';
            card.innerHTML = `
                <img src="${perfume.image}" alt="${perfume.name}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${perfume.name}</h3>
                    <p class="card-description">${perfume.description}</p>
                    <div class="card-footer">
                        <div class="price">${perfume.price.toLocaleString()}₽</div>
                        <span class="category-badge">${getCategoryName(perfume.category)}</span>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => showProductModal(perfume));
            grid.appendChild(card);
        });
    }
    
    // Получаем название категории
    function getCategoryName(category) {
        const categories = {
            arabian: 'Арабские',
            premium: 'Премиум',
            affordable: 'Доступные'
        };
        return categories[category] || category;
    }
    
    // Показываем каталог
    function showCatalog() {
        document.getElementById('catalogContainer').style.display = 'block';
        document.querySelector('.hero-section').style.display = 'none';
        document.querySelector('.actions').style.display = 'none';
    }
    
    // Скрываем каталог
    function hideCatalog() {
        document.getElementById('catalogContainer').style.display = 'none';
        document.querySelector('.hero-section').style.display = 'block';
        document.querySelector('.actions').style.display = 'flex';
    }
    
    // Фильтрация духов
    function filterPerfumes() {
        const category = document.getElementById('categoryFilter').value;
        const price = document.getElementById('priceFilter').value;
        
        let filtered = [...perfumes];
        
        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }
        
        if (price !== 'all') {
            switch(price) {
                case 'low':
                    filtered = filtered.filter(p => p.price < 3000);
                    break;
                case 'medium':
                    filtered = filtered.filter(p => p.price >= 3000 && p.price <= 10000);
                    break;
                case 'high':
                    filtered = filtered.filter(p => p.price > 10000);
                    break;
            }
        }
        
        displayPerfumes(filtered);
    }
    
    // Показываем модальное окно товара
    function showProductModal(perfume) {
        document.getElementById('modalTitle').textContent = perfume.name;
        document.getElementById('modalDescription').textContent = perfume.description;
        document.getElementById('modalPrice').textContent = `${perfume.price.toLocaleString()}₽`;
        document.getElementById('modalCategory').textContent = getCategoryName(perfume.category);
        document.getElementById('modalRating').textContent = perfume.rating;
        document.getElementById('modalImage').src = perfume.image;
        document.getElementById('productModal').style.display = 'flex';
    }
    
    // Скрываем модальное окно
    function hideModal() {
        document.getElementById('productModal').style.display = 'none';
    }
    
    // Оформление заказа
    function placeOrder() {
        const perfumeName = document.getElementById('modalTitle').textContent;
        
        // Отправляем данные в Telegram
        const orderData = {
            user: user.username,
            perfume: perfumeName,
            timestamp: new Date().toISOString()
        };
        
        tg.sendData(JSON.stringify(orderData));
        
        // Показываем уведомление
        tg.showAlert(`Спасибо за заказ! ${perfumeName} скоро будет у вас.`);
        
        hideModal();
    }
    
    // Показываем фильтры (дополнительные)
    function showFilters() {
        alert('Дополнительные фильтры будут доступны в следующем обновлении!');
    }
    
    // Показываем заказы
    function showOrders() {
        alert('История заказов появится после первых покупок!');
    }
    
    // Показываем админ-панель
    function showAdminPanel() {
        window.location.href = 'admin.html';
    }
});

// Закрываем модальное окно при клике вне его
window.addEventListener('click', function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        hideModal();
    }
});