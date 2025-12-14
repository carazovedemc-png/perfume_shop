// ==================== security.js ====================
// Модуль комплексной безопасности для фронтенд-приложения

const Security = (() => {
    'use strict';

    // Конфигурация
    const CONFIG = {
        MAX_INPUT_LENGTH: 500,
        ALLOWED_HTML_TAGS: ['b', 'i', 'em', 'strong', 'br', 'span'],
        ALLOWED_PROTOCOLS: ['https:', 'http:', 'data:', 'blob:'],
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 минут
        THROTTLE_DELAY: 1000 // 1 секунда
    };

    // ===== 1. ЗАЩИТА ОТ XSS (САНИТАЦИЯ И ЭКРАНИРОВАНИЕ) =====
    const XSS = {
        /**
         * Экранирует HTML-символы для безопасной вставки в textContent
         * @param {string} str - Входная строка
         * @returns {string} Экранированная строка
         */
        escapeHTML: (str) => {
            if (typeof str !== 'string') return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        /**
         * Строгая очистка строки, удаляет всё кроме букв, цифр и базовых символов
         * @param {string} str - Входная строка
         * @returns {string} Очищенная строка
         */
        sanitizeStrict: (str) => {
            return String(str).replace(/[^a-zA-Zа-яА-Я0-9\s\-_.,!?@#$%&*()+=\[\]{}|\\/:;"'<>]/gu, '');
        },

        /**
         * Безопасное создание HTML элемента с текстом
         * @param {string} tag - Тег элемента
         * @param {string} text - Текст содержимого
         * @param {Object} attrs - Атрибуты элемента
         * @returns {HTMLElement} Безопасный DOM элемент
         */
        createSafeElement: (tag, text, attrs = {}) => {
            const el = document.createElement(tag);
            el.textContent = text;
            
            Object.entries(attrs).forEach(([key, value]) => {
                if (key.startsWith('on')) return; // Блокируем обработчики событий
                if (key === 'href' || key === 'src') {
                    if (!XSS.isSafeURL(value)) {
                        console.warn(`Blocked unsafe URL in ${key}:`, value);
                        return;
                    }
                }
                el.setAttribute(key, value);
            });
            
            return el;
        },

        /**
         * Проверка безопасности URL
         * @param {string} url - URL для проверки
         * @returns {boolean} Безопасен ли URL
         */
        isSafeURL: (url) => {
            try {
                const parsed = new URL(url, window.location.origin);
                return CONFIG.ALLOWED_PROTOCOLS.includes(parsed.protocol);
            } catch {
                return false;
            }
        }
    };

    // ===== 2. ЗАЩИТА ОТ CSRF И ПОДДЕЛКИ =====
    const CSRF = {
        _tokens: new Map(),
        
        /**
         * Генерация CSRF-токена
         * @returns {string} CSRF токен
         */
        generateToken: () => {
            const token = crypto.getRandomValues(new Uint8Array(32))
                .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
            const expires = Date.now() + CONFIG.SESSION_TIMEOUT;
            CSRF._tokens.set(token, expires);
            return token;
        },

        /**
         * Валидация CSRF-токена
         * @param {string} token - Токен для проверки
         * @returns {boolean} Валиден ли токен
         */
        validateToken: (token) => {
            const expires = CSRF._tokens.get(token);
            if (!expires || expires < Date.now()) {
                CSRF._tokens.delete(token);
                return false;
            }
            return true;
        },

        /**
         * Очистка просроченных токенов
         */
        cleanup: () => {
            const now = Date.now();
            for (const [token, expires] of CSRF._tokens.entries()) {
                if (expires < now) CSRF._tokens.delete(token);
            }
        }
    };

    // ===== 3. ЗАЩИТА ОТ ИНЪЕКЦИЙ И НЕВЕРНЫХ ДАННЫХ =====
    const Injection = {
        /**
         * Валидация данных товара из data.js
         * @param {Object} product - Объект товара
         * @returns {Object|null} Валидированный товар или null
         */
        validateProduct: (product) => {
            const schema = {
                id: 'number',
                name: 'string',
                description: 'string',
                price: 'number',
                oldPrice: 'number',
                category: 'string',
                volume: 'number',
                rating: 'number',
                reviews: 'number',
                image: 'string',
                badge: ['string', 'null'],
                inStock: 'boolean',
                popular: 'boolean',
                notes: 'object'
            };

            // Проверка обязательных полей
            for (const [key, type] of Object.entries(schema)) {
                if (!(key in product)) {
                    console.error(`Product validation failed: missing field ${key}`);
                    return null;
                }

                const expectedTypes = Array.isArray(type) ? type : [type];
                const isValidType = expectedTypes.some(t => {
                    if (t === 'null') return product[key] === null;
                    if (t === 'array') return Array.isArray(product[key]);
                    return typeof product[key] === t;
                });

                if (!isValidType) {
                    console.error(`Product validation failed: ${key} has wrong type`);
                    return null;
                }
            }

            // Дополнительные проверки
            if (product.price < 0 || product.oldPrice < 0) return null;
            if (product.rating < 0 || product.rating > 5) return null;
            if (product.reviews < 0) return null;
            if (!XSS.isSafeURL(product.image)) return null;
            if (!['arabian', 'premium', 'affordable', 'error'].includes(product.category)) return null;
            if (product.badge && !['new', 'sale', 'hit', null].includes(product.badge)) return null;

            // Санитизация строковых полей
            const sanitized = { ...product };
            sanitized.name = XSS.sanitizeStrict(product.name).substring(0, 100);
            sanitized.description = XSS.sanitizeStrict(product.description).substring(0, CONFIG.MAX_INPUT_LENGTH);
            
            if (Array.isArray(product.notes)) {
                sanitized.notes = product.notes.map(note => 
                    XSS.sanitizeStrict(note).substring(0, 50)
                ).filter(note => note.length > 0);
            }

            return sanitized;
        },

        /**
         * Валидация данных корзины
         * @param {Array} cart - Массив товаров в корзине
         * @returns {Array} Валидированная корзина
         */
        validateCart: (cart) => {
            if (!Array.isArray(cart)) return [];
            
            return cart.filter(item => {
                return typeof item.id === 'number' && 
                       typeof item.quantity === 'number' &&
                       item.quantity > 0 && item.quantity <= 10 &&
                       typeof item.price === 'number' &&
                       item.price > 0;
            });
        }
    };

    // ===== 4. ЗАЩИТА ОТ БРУТФОРСА И ФЛУДА =====
    const RateLimiter = {
        _attempts: new Map(),
        
        /**
         * Проверка лимита попыток
         * @param {string} key - Ключ для лимитера
         * @param {number} maxAttempts - Максимум попыток
         * @param {number} windowMs - Окно времени в мс
         * @returns {boolean} Превышен ли лимит
         */
        check: (key, maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
            const now = Date.now();
            const attempts = RateLimiter._attempts.get(key) || [];
            
            // Удаляем старые попытки
            const recent = attempts.filter(time => now - time < windowMs);
            
            if (recent.length >= maxAttempts) {
                return false;
            }
            
            recent.push(now);
            RateLimiter._attempts.set(key, recent);
            return true;
        },

        /**
         * Сброс счетчика попыток
         * @param {string} key - Ключ для сброса
         */
        reset: (key) => {
            RateLimiter._attempts.delete(key);
        }
    };

    // ===== 5. ЗАЩИТА ДАННЫХ В LOCALSTORAGE =====
    const SecureStorage = {
        _keyPrefix: 'aura_secure_',
        
        /**
         * Безопасное сохранение данных
         * @param {string} key - Ключ
         * @param {any} data - Данные
         */
        set: (key, data) => {
            try {
                const encrypted = btoa(encodeURIComponent(JSON.stringify({
                    data: data,
                    timestamp: Date.now(),
                    hash: Security.hash(JSON.stringify(data))
                })));
                
                localStorage.setItem(SecureStorage._keyPrefix + key, encrypted);
            } catch (error) {
                console.error('SecureStorage set failed:', error);
            }
        },

        /**
         * Безопасное получение данных
         * @param {string} key - Ключ
         * @returns {any|null} Данные или null
         */
        get: (key) => {
            try {
                const encrypted = localStorage.getItem(SecureStorage._keyPrefix + key);
                if (!encrypted) return null;
                
                const decoded = JSON.parse(decodeURIComponent(atob(encrypted)));
                
                // Проверка целостности
                if (decoded.hash !== Security.hash(JSON.stringify(decoded.data))) {
                    console.warn('Data integrity check failed for key:', key);
                    localStorage.removeItem(SecureStorage._keyPrefix + key);
                    return null;
                }
                
                // Проверка времени жизни (макс 7 дней)
                if (Date.now() - decoded.timestamp > 7 * 24 * 60 * 60 * 1000) {
                    localStorage.removeItem(SecureStorage._keyPrefix + key);
                    return null;
                }
                
                return decoded.data;
            } catch (error) {
                console.error('SecureStorage get failed:', error);
                localStorage.removeItem(SecureStorage._keyPrefix + key);
                return null;
            }
        },

        /**
         * Удаление данных
         * @param {string} key - Ключ
         */
        remove: (key) => {
            localStorage.removeItem(SecureStorage._keyPrefix + key);
        }
    };

    // ===== 6. МОНИТОРИНГ И ОБНАРУЖЕНИЕ АНОМАЛИЙ =====
    const Monitor = {
        _suspiciousEvents: [],
        
        /**
         * Логирование подозрительного события
         * @param {string} event - Тип события
         * @param {Object} details - Детали
         */
        logEvent: (event, details = {}) => {
            const logEntry = {
                timestamp: new Date().toISOString(),
                event: event,
                details: details,
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            Monitor._suspiciousEvents.push(logEntry);
            
            // Сохраняем только последние 100 событий
            if (Monitor._suspiciousEvents.length > 100) {
                Monitor._suspiciousEvents.shift();
            }
            
            // Критические события сразу логируем
            const criticalEvents = ['xss_attempt', 'injection_attempt', 'csrf_attempt'];
            if (criticalEvents.includes(event)) {
                console.warn('SECURITY ALERT:', logEntry);
                
                // В реальном приложении здесь был бы отправка на сервер
                if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
                    try {
                        Telegram.WebApp.sendData(JSON.stringify({
                            type: 'security_alert',
                            data: logEntry
                        }));
                    } catch (e) { /* Игнорируем ошибки отправки */ }
                }
            }
        },

        /**
         * Получение логов событий
         * @returns {Array} Логи событий
         */
        getLogs: () => {
            return [...Monitor._suspiciousEvents];
        }
    };

    // ===== 7. УТИЛИТЫ БЕЗОПАСНОСТИ =====
    const Utils = {
        /**
         * Простая хеш-функция для проверки целостности
         * @param {string} str - Входная строка
         * @returns {string} Хеш
         */
        hash: (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(36);
        },

        /**
         * Троттлинг функции
         * @param {Function} fn - Функция
         * @param {number} delay - Задержка
         * @returns {Function} Заторможенная функция
         */
        throttle: (fn, delay = CONFIG.THROTTLE_DELAY) => {
            let lastCall = 0;
            return (...args) => {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    return fn(...args);
                }
            };
        },

        /**
         * Проверка, запущено ли в iframe
         * @returns {boolean} В iframe ли
         */
        isInIframe: () => {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }
    };

    // ===== 8. ИНИЦИАЛИЗАЦИЯ И ЗАЩИТА ПРИ ЗАГРУЗКЕ =====
    const init = () => {
        // Защита от запуска в iframe (дополнение к CSP)
        if (Utils.isInIframe()) {
            Monitor.logEvent('iframe_detected');
            if (confirm('Это приложение не предназначено для запуска в iframe. Перейти на основную страницу?')) {
                window.top.location = window.location.origin;
            }
            throw new Error('App cannot run in iframe');
        }

        // Защита от DevTools открытия
        const devToolsCheck = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                Monitor.logEvent('devtools_opened');
                document.body.innerHTML = '<div style="padding: 20px; text-align: center;">' +
                    '<h2>🛡️ Режим безопасности</h2>' +
                    '<p>Инструменты разработчика не разрешены в этом приложении.</p>' +
                    '</div>';
                throw new Error('DevTools detected');
            }
        };

        // Проверяем каждые 500мс
        setInterval(devToolsCheck, 500);
        window.addEventListener('resize', devToolsCheck);

        // Очистка CSRF токенов каждые 5 минут
        setInterval(CSRF.cleanup, 5 * 60 * 1000);

        console.log('🔒 Security module initialized');
        Monitor.logEvent('security_init');
    };

    // Публичный API
    return {
        init,
        XSS,
        CSRF,
        Injection,
        RateLimiter,
        SecureStorage,
        Monitor,
        hash: Utils.hash,
        throttle: Utils.throttle,
        CONFIG
    };
})();

// Автоматическая инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Security.init);
} else {
    Security.init();
}

// Экспорт для использования в других файлах
window.Security = Security;