// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ =====
const tg = window.Telegram?.WebApp || {};
let user = null;
let allProducts = [];
let cart = [];
let favorites = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 8;
let savedAddress = null;

// Ключи для localStorage
const STORAGE_KEYS = {
    CART: 'aura_atelier_cart',
    FAVORITES: 'aura_atelier_favorites',
    USER: 'aura_atelier_user',
    AVATAR: 'aura_atelier_avatar',
    USERNAME: 'aura_atelier_username',
    ADDRESS: 'aura_atelier_address'
};

// ДАННЫЕ ТОВАРОВ
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Aris 222 VIP Bleck",
        description: "Представленный на изображении товар — это Aris 222 VIP Black, концентрированное парфюмерное масло духи без спирта. Верхние ноты: Абсент, анис и фенхель. Средняя нота: Лаванда. Базовые ноты: Черная ваниль и мускус.",
        price: 350,
        oldPrice: 0,
        category: "premium",
        volume: 6,
        rating: 4.8,
        reviews: 124,
        image: "https://sun9-80.userapi.com/s/v1/ig2/POV_jt4v0MEj7d-4gdkRYIFYTBL-hvXmDLOjJKlY-RqeOgcO1NxWHXAss7UBTzkvI8rdLMEdpqZwJeARBqh7iyc3.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=tt6otIk9Wzym_IH9u6oWb4gDXhDWpPwiNQ5muEOgTHo&cs=240x0",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["лаванда", "чёрная ваниль", "мускус"]
    },
    {
        id: 2,
        name: "Dalal",
        description: "Dalal — масляные духи бренда Al Rehab из ОАЭ. Относятся к семейству сладких, древесных и гурманских ароматов. Благодаря масляной консистенции духи имеют хорошую стойкость и экономичны в расходе. Запах держится до 12 часов! Аромат: Верхние ноты: апельсин. Ноты сердца: карамель, ваниль. Базовые ноты: сандаловое дерево. Композиция напоминает о карамельном чизкейке и ванильном мороженом с апельсиновым джемом.",
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
        description: "Это - женские духи из группы восточные гурманские. Композиция глубокая, насыщенная, сладкая и притягательная. Верхние ноты: груша, розовый перец и цветок апельсина. Средние ноты: кофе, жасмин, горький миндаль и лакричник. Базовые ноты: ваниль, пачули, кедр и кашемировое дерево.",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.6,
        reviews: 100,
        image: "https://sun9-43.userapi.com/s/v1/ig2/7OuPKSCxdwp7oHCuEccqLkHkK_-ovx6ks842VjcS4nIExZ1VGhdLfUhSz-ueglS4PgI_fh29HEvPqFLzNlKj3tej.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=DTS3NJnjcShlWzwIHzZ9tgVLIOKUx8JWVEEhGsoYZH0&cs=640x0",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["кофе", "жасмин", "ваниль", "кедр", "горький миндаль"]
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
        badge: null,
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
        badge: null,
        inStock: true,
        popular: true,
        notes: ["ваниль", "сандал", "мускус"]
    },
    {
        id: 8,
        name: "Al Rayan G&D Limperatrice",
        description: "Al Rayan G&D Limperatrice — это концентрированное масляное парфюмерное масло аттар. Композиция аромата включает следующие ноты: Верхние ноты: Розовый перец, ревень, киви. Средние ноты сердце: Арбуз, цикламен, жасмин. Базовые ноты: Мускус, сандал, лимонное китайское дерево. Описание Аромат описывается как яркий, игривый и энергичный, с доминирующими аккордами сочных тропических фруктов и свежести. Он подходит для дневного ношения, особенно в весенне-летний период.",
        price: 350,
        oldPrice: 0,
        category: "affordable",
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
        badge: null,
        inStock: true,
        popular: true,
        notes: ["кедр", "абрикос", "розовый перец"]
    },
    {
        id: 10,
        name: "Lacoste green",
        description: "Это — фужерный, цитрусовый аромат для мужчин. стойкое звучание аромата благодаря натуральным маслам и отсутствию спирта; шлейф благодаря тяжёлым молекулам, который раскрывается неторопливо под воздействием тепла кожи и перемены окружающей среды; изменчивость аромата: в тёплом помещении или на жаркой летней улице духи звучат сильнее, раскрываясь под воздействием температуры. Верхние ноты: грейпфрут, дыня, ноты бергамота. Ноты сердца: лимонная вербена, лаванда, тмин. Базовые ноты: берёза, инжир.",
        price: 350,
        oldPrice: 0,
        category: "premium",
        volume: 6,
        rating: 4.9,
        reviews: 189,
        image: "https://sun9-78.userapi.com/s/v1/ig2/NjbkM41fqN_ElkBHjJWyzjAoGorjvfDBd881IiagMDgy853FarvwWKOFlIK8N_cXQH2xd0lgrKkQb3tIMWLVpBHo.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=VPX8vTYi-reFtDkiHwd1GmDpWymqCFgG4vqjSKpfa4Y&cs=640x0",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["дыня", "береза", "инжир"]
    },
    {
        id: 11,
        name: "Black Afgano",
        description: "Изображенный на фото товар — это масляные духи с феромонами объемом  6 мл под названием Black Afgano, выпущенные под маркой Pheromon Limited Edition. Описание продукта: Масляные духи с феромонами унисекс. Аромат: Это парфюмерное масло вдохновлено известным оригинальным ароматом Nasomatto Black Afgano, который отличается густым, дымным, древесным и плотным звучанием с нотами смолы, кофе, табака и ладана",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.5,
        reviews: 78,
        image: "https://sun9-4.userapi.com/s/v1/ig2/XtGtcV14S3upSGqy5SMaZwgHF1oUkavESD9-FDqy08tU3pzNmPw9VN9tMjRx0nVdPIpeM-FfdeutQbG-9o5R8qHR.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=4GI8IGXu6hM54RSYQlvBZjdBhjxuFYbLoDgmtTTHXZM&cs=240x0",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["табак", "смола", "кофе"]
    },
    {
        id: 12,
        name: "Lost cherry Tom ford",
        description: "Детали продукта Оригинальный аромат: Lost Cherry от Tom Ford - это люксовая восточно-цветочная парфюмерная вода Eau de Parfum для мужчин и женщин, выпущенная в 2018 году. Продукт на изображении, является масляными духами, вдохновленными оригинальным ароматом, часто с добавлением синтетических феромонов.",
        price: 350,
        oldPrice: 0,
        category: "premium",
        volume: 6,
        rating: 4.8,
        reviews: 312,
        image: "https://sun9-38.userapi.com/s/v1/ig2/uPgqjLUFPMlBHeNEe9CCZYzn1wappYDHmT_cDn8aldq8HidoeXPwyOAX5OHL1YJ1s94WORcWvEZY9hZPwfHFJSZV.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=o2THPZ5FizJ22_R1Sr3J0c12VSXfXGC4rYgfpYfpR1c&cs=240x0",
        badge: "hit",
        inStock: true,
        popular: true,
        notes: ["вишня", "миндаль", "роза"]
    },
    {
        id: 13,
        name: "LACOSTE ESSENTIAL",
        description: "Lacoste essential pheromon Limited Edition — это масляные духи с феромонами. Тип аромата: Древесный, фужерный",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.5,
        reviews: 137,
        image: "https://sun9-22.userapi.com/s/v1/ig2/q2Pv9a9helePHmcz5NOLAfWetXLXxiksBtqbkvLyhqcIH3WDHiF0WcdYKakuhqtM_5FKe7_qO_DXn2BSWh07-CtR.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=vWg79uv0PR6vMntoQuUoyKEJJtWacOOeOXpjH-juSrw&cs=240x0",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["древесный", "фужерный"]
    },
    {
        id: 14,
        name: "Allur Home Sport",
        description: "Парфюм на изображении — это Pheromon Limited Edition Allur Home Sport, который представляет собой версию с феромонами, вдохновленную известным ароматом Chanel Allure Homme Sport. Аромат: Мужской, относится к группе древесных пряных ароматов. Композиция сочетает цитрусовые, морские и древесные ноты.",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.4,
        reviews: 146,
        image: "https://sun9-3.userapi.com/s/v1/ig2/SPsgBvzNMm9FCG0YhncWZd7GwB075inz1ZySBRggHyw8GU51Yw96PUJq27KzHFV7DRUHMixSIG6qzfHo_jOOZeKk.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=g54CooC5RUFBToh3mgEDVpcyjM5ZOBuPHTAxQSTK4_g&cs=240x0",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["цитрус", "морской", "древесный"]
    },
    {
        id: 15,
        name: "Acqua Di Gio Giorgio Armani",
        description: "Pheromon Limited Edition Acqua Di Gio Giorgio Armani — это версия туалетной воды Acqua Di Gio, представленная в формате масляных духов с феромонами. Ноты: Композиция включает морские ноты, розмарин, жасмин, кедр и пачули.",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.7,
        reviews: 155,
        image: "https://sun9-66.userapi.com/s/v1/ig2/sUV2Bm7T9gnxiIqW9DeH4hUXCVNMM4X9xK5wGFKb3ULdjzYum2NsCq7MnCwZi_M76c_dZOsIml1i8tKRn0m9siRM.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=FOrDOsjR7X_6WNiekSjoAHlQU__DAfnKBnvSaCF4bzw&cs=240x0",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["кедр", "жасмин", "пачули"]
    },
    {
        id: 16,
        name: "Sospiro Erba Pura",
        description: "Представленный товар — это масляные духи с феромонами Sospiro Erba Pura Limited Edition. Аромат: Композиция описывается как свежая, с нотами апельсина, лимона и бергамота в верхних нотах, фруктовым сердцем и базой из амбры, белого мускуса и мадагаскарской ванили.",
        price: 350,
        oldPrice: 0,
        category: "affordable",
        volume: 6,
        rating: 4.6,
        reviews: 212,
        image: "https://sun9-49.userapi.com/s/v1/ig2/HlvVp54Fl1yUYEQrIdMsqsbhrFZjmkzV7Kc3WHJiFUW8SLzG8ptT3CHHRYgCyPp1t3SsCtIjqmnFt1DohZTPoqzf.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=iSxrvU5lePOWtaEQ2vUPQra_jXzu-0msPIKa2wzHVRw&cs=360x0",
        badge: null,
        inStock: true,
        popular: false,
        notes: ["лимон", "белый мускус", "бергамот"]
    },
    {
        id: 17,
        name: "Aamal Perfume Kirkèy",
        description: "Aamal Perfume Kirkèy — выразительный и устойчивый аромат в стильном серебристом флаконе объёмом 10 мл. Композиция раскрывается яркими верхними акцентами, продолжает с насыщенным сердцем, а в базе остаётся тёплая, благородная древесно-амбровая подложка.",
        price: 600,
        oldPrice: 0,
        category: "premium",
        volume: 10,
        rating: 4.9,
        reviews: 812,
        image: "https://sun9-88.userapi.com/s/v1/ig2/rTw-cKmVkkw3lCPa5uzf-XhDLQXVxkC97Wp14jqjC--1nMdE5qDAK82u9q-yoYe3j7e_0Wshx9EGY-JSE1FVBkzV.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2560x2560&from=bu&u=cB1Hj3xqPdYrsJuEGjMwZ8cjtK3h4jxlBiJBYwKJwmE&cs=360x0",
        badge: null,
        inStock: true,
        popular: true,
        notes: ["дерево", "амбра", "ваниль"]
    }
];

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadData();
    renderProducts();
    updateCounters();
    initBannerSwitcher();
    initAvatarSystem();
    initDeliveryAddress();
    initEventListeners();
    setupProductCardClick();
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

// ===== СИСТЕМА АВАТАРОК =====
function initAvatarSystem() {
    const avatarUpload = document.getElementById('avatarUpload');
    const userAvatar = document.getElementById('userAvatar');
    const avatarContainer = document.querySelector('.user-avatar-container');
    const userNameEl = document.getElementById('username');

    // Загружаем сохраненные данные
    const savedAvatar = localStorage.getItem(STORAGE_KEYS.AVATAR);
    const savedName = localStorage.getItem(STORAGE_KEYS.USERNAME) || (user ? user.firstName : 'Гость');

    if (savedAvatar) {
        userAvatar.src = savedAvatar;
    } else {
        // Устанавливаем стандартный аватар
        userAvatar.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="40" r="20" fill="%238A2BE2"/><circle cx="50" cy="90" r="30" fill="%238A2BE2"/></svg>';
    }
    
    userNameEl.textContent = savedName;

    // Обработчик клика для загрузки фото
    avatarContainer.addEventListener('click', function(e) {
        e.preventDefault();
        avatarUpload.click();
    });

    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Проверяем тип файла
        if (!file.type.match('image.*')) {
            showNotification('Пожалуйста, выберите файл изображения', 'error');
            return;
        }

        // Проверяем размер файла (макс. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Изображение слишком большое (макс. 5MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            userAvatar.src = event.target.result;
            localStorage.setItem(STORAGE_KEYS.AVATAR, event.target.result);
            showNotification('Аватар обновлен!', 'success');
        };
        reader.onerror = function() {
            showNotification('Ошибка при загрузке изображения', 'error');
        };
        reader.readAsDataURL(file);
    });

    // Редактирование имени
    userNameEl.addEventListener('click', function(e) {
        e.stopPropagation();
        const newName = prompt('Введите ваше имя:', this.textContent);
        if (newName && newName.trim() !== '') {
            const trimmedName = newName.trim();
            this.textContent = trimmedName;
            localStorage.setItem(STORAGE_KEYS.USERNAME, trimmedName);
            showNotification('Имя обновлено!', 'success');
        }
    });
}

// ===== СИСТЕМА АДРЕСА ДОСТАВКИ =====
function initDeliveryAddress() {
    const saveBtn = document.getElementById('saveAddressBtn');
    const editBtn = document.getElementById('editAddressBtn');
    const addressDisplay = document.getElementById('savedAddressDisplay');
    const addressText = document.getElementById('addressText');
    const addressForm = document.getElementById('addressForm');

    // Загружаем сохраненный адрес
    savedAddress = loadFromStorage(STORAGE_KEYS.ADDRESS, null);

    function updateAddressDisplay() {
        if (savedAddress && savedAddress.street) {
            const addr = `${savedAddress.street}, д. ${savedAddress.house}` + 
                       (savedAddress.apartment ? `, кв. ${savedAddress.apartment}` : '') +
                       (savedAddress.intercom ? ` (домофон: ${savedAddress.intercom})` : '');
            addressText.textContent = addr;
            addressDisplay.style.display = 'block';
            addressForm.style.display = 'none';
        } else {
            addressDisplay.style.display = 'none';
            addressForm.style.display = 'block';
        }
        updateDeliveryCost();
    }

    updateAddressDisplay();

    // Сохранение адреса
    saveBtn.addEventListener('click', function() {
        const addressData = {
            street: document.getElementById('deliveryStreet').value.trim(),
            house: document.getElementById('deliveryHouse').value.trim(),
            apartment: document.getElementById('deliveryApartment').value.trim(),
            intercom: document.getElementById('deliveryIntercom').value.trim(),
            comment: document.getElementById('deliveryComment').value.trim()
        };

        if (!addressData.street || !addressData.house) {
            showNotification('Заполните обязательные поля: улица и дом', 'warning');
            return;
        }

        savedAddress = addressData;
        localStorage.setItem(STORAGE_KEYS.ADDRESS, JSON.stringify(addressData));
        updateAddressDisplay();
        showNotification('Адрес сохранен!', 'success');
    });

    // Редактирование адреса
    editBtn.addEventListener('click', function() {
        if (savedAddress) {
            document.getElementById('deliveryStreet').value = savedAddress.street || '';
            document.getElementById('deliveryHouse').value = savedAddress.house || '';
            document.getElementById('deliveryApartment').value = savedAddress.apartment || '';
            document.getElementById('deliveryIntercom').value = savedAddress.intercom || '';
            document.getElementById('deliveryComment').value = savedAddress.comment || '';
        }
        addressDisplay.style.display = 'none';
        addressForm.style.display = 'block';
    });
}

function updateDeliveryCost() {
    const deliveryCostEl = document.getElementById('deliveryCost');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let deliveryCost = 0;

    // Бесплатная доставка от 5000 рублей
    if (subtotal < 5000 && subtotal > 0) {
        deliveryCost = 300; // Стоимость доставки
    }

    deliveryCostEl.textContent = `${deliveryCost.toLocaleString()} ₽`;
    return deliveryCost;
}

// ===== БАННЕРЫ =====
function initBannerSwitcher() {
    const banner1 = document.getElementById('banner1');
    const banner2 = document.getElementById('banner2');
    let currentBanner = 1;
    
    function switchBanner() {
        if (currentBanner === 1) {
            banner1.classList.remove('active');
            banner2.classList.add('active');
            currentBanner = 2;
        } else {
            banner2.classList.remove('active');
            banner1.classList.add('active');
            currentBanner = 1;
        }
    }
    
    // Переключаем баннеры каждые 10 секунд
    setInterval(switchBanner, 10000);
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
            addedAt: new Date().toISOString()
        });
        showNotification(`${product.name} добавлен в корзину`, 'success');
    }
    
    // Сохраняем в localStorage
    saveToStorage(STORAGE_KEYS.CART, cart);
    
    // Обновляем UI
    updateCounters();
    updateCartPopup();
    renderProducts();
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
        document.getElementById('deliveryCost').textContent = '0 ₽';
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
    const deliveryCost = updateDeliveryCost();
    const total = subtotal - discount + deliveryCost;
    
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
    updateCounters();
    updateCartPopup();
    renderProducts();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Сохраняем
    saveToStorage(STORAGE_KEYS.CART, cart);
    
    // Обновляем UI
    updateCounters();
    updateCartPopup();
    renderProducts();
    
    showNotification('Товар удален из корзины', 'info');
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
    updateCounters();
    updateFavoritesPopup();
    renderProducts();
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
    updateCounters();
    updateFavoritesPopup();
    renderProducts();
    
    showNotification('Товар удален из избранного', 'info');
}

// ===== ОБНОВЛЕНИЕ СЧЕТЧИКОВ =====
function updateCounters() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const favCount = favorites.length;
    
    // Обновляем счетчики в хедере
    const headerCartCount = document.getElementById('headerCartCount');
    const headerFavCount = document.getElementById('headerFavCount');
    
    if (headerCartCount) {
        headerCartCount.textContent = cartCount;
        headerCartCount.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    
    if (headerFavCount) {
        headerFavCount.textContent = favCount;
        headerFavCount.style.display = favCount > 0 ? 'flex' : 'none';
    }
    
    // Обновляем счетчики в нижней панели
    const bottomCartCount = document.getElementById('bottomCartCount');
    const bottomFavCount = document.getElementById('bottomFavCount');
    
    if (bottomCartCount) {
        bottomCartCount.textContent = cartCount;
        bottomCartCount.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    
    if (bottomFavCount) {
        bottomFavCount.textContent = favCount;
        bottomFavCount.style.display = favCount > 0 ? 'flex' : 'none';
    }
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
                    showProductDetailsModal(product);
                }
            }
        }
    });
}

function showProductDetailsModal(product) {
    // Закрываем другие модальные окна
    closeCartPopup();
    closeFavoritesPopup();
    closeFilterPopup();
    closeContactPopup();
    closeProductDetailsModal();
    
    const modal = document.getElementById('productDetailsModal');
    const modalBody = document.getElementById('modalBody');
    const modalBadge = document.getElementById('modalBadge');
    const overlay = document.getElementById('productModalOverlay');
    
    if (!modal || !modalBody) return;
    
    const isInCart = cart.some(item => item.id === product.id);
    const isInFavorites = favorites.some(item => item.id === product.id);
    
    // Определяем бейдж
    let badgeHtml = '';
    if (product.badge === 'new') {
        modalBadge.className = 'modal-badge modal-badge-new';
        modalBadge.textContent = 'Новинка';
        modalBadge.style.display = 'block';
    } else if (product.badge === 'sale') {
        modalBadge.className = 'modal-badge modal-badge-sale';
        modalBadge.textContent = 'Скидка';
        modalBadge.style.display = 'block';
    } else if (product.badge === 'hit') {
        modalBadge.className = 'modal-badge modal-badge-hit';
        modalBadge.textContent = 'Хит';
        modalBadge.style.display = 'block';
    } else {
        modalBadge.style.display = 'none';
    }
    
    // Расчет скидки
    const discountPercent = product.oldPrice > 0 
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;
    
    // Создаем HTML для нот аромата
    const notesHtml = product.notes ? 
        product.notes.map(note => `<span class="note-tag">${note}</span>`).join('') : 
        '';
    
    modalBody.innerHTML = `
        <div class="product-image-section">
            <img src="${product.image}" alt="${product.name}" class="modal-product-image">
        </div>
        
        <div class="product-info-section">
            <h2 class="modal-product-title">${product.name}</h2>
            
            <div class="product-meta">
                <span class="meta-category">
                    <i class="fas fa-tag"></i> ${getCategoryName(product.category)}
                </span>
                <span class="meta-volume">
                    <i class="fas fa-weight"></i> ${product.volume} мл
                </span>
                <span class="meta-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    <i class="fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i> 
                    ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
            </div>
            
            <div class="modal-rating">
                <div class="modal-stars">
                    ${renderStars(product.rating)}
                </div>
                <span class="modal-rating-value">${product.rating}</span>
                <span class="modal-reviews">(${product.reviews} отзывов)</span>
            </div>
            
            <div class="product-description">
                <h3><i class="fas fa-info-circle"></i> Описание</h3>
                <p>${product.description}</p>
            </div>
            
            <div class="product-notes">
                <h3><i class="fas fa-wind"></i> Ноты аромата</h3>
                <div class="notes-container">
                    ${notesHtml}
                </div>
            </div>
            
            <div class="product-pricing">
                <div class="price-section">
                    <div class="current-price">${product.price.toLocaleString()} ₽</div>
                    ${product.oldPrice > 0 ? `
                        <div class="old-price-section">
                            <span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>
                            <span class="discount-badge">-${discountPercent}%</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="product-actions-modal">
                <button class="btn-add-to-cart ${isInCart ? 'in-cart' : ''}" data-id="${product.id}">
                    <i class="fas ${isInCart ? 'fa-check' : 'fa-shopping-cart'}"></i>
                    ${isInCart ? 'В корзине' : 'Добавить в корзину'}
                </button>
                <button class="btn-add-to-fav ${isInFavorites ? 'active' : ''}" data-id="${product.id}">
                    <i class="${isInFavorites ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            
            <div class="product-features">
                <div class="feature">
                    <i class="fas fa-shipping-fast"></i>
                    <span>Бесплатная доставка по Симферополю от 5000₽</span>
                </div>
                <div class="feature">
                    <i class="fas fa-shield-alt"></i>
                    <span>100% оригинальная продукция</span>
                </div>
                <div class="feature">
                    <i class="fas fa-award"></i>
                    <span>Гарантия качества</span>
                </div>
            </div>
        </div>
    `;
    
    // Показываем модальное окно
    modal.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Добавляем обработчики для кнопок в модальном окне
    setTimeout(() => {
        const cartBtn = modalBody.querySelector('.btn-add-to-cart');
        const favBtn = modalBody.querySelector('.btn-add-to-fav');
        const closeBtn = document.getElementById('closeDetailsModalBtn');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                const productId = parseInt(this.dataset.id);
                toggleCart(productId, e);
                
                // Обновляем состояние кнопки в модалке
                setTimeout(() => {
                    const isNowInCart = cart.some(item => item.id === productId);
                    if (isNowInCart) {
                        this.innerHTML = '<i class="fas fa-check"></i> В корзине';
                        this.classList.add('in-cart');
                    } else {
                        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Добавить в корзину';
                        this.classList.remove('in-cart');
                    }
                }, 100);
            });
        }
        
        if (favBtn) {
            favBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                const productId = parseInt(this.dataset.id);
                toggleFavorite(productId, e);
                
                // Обновляем состояние кнопки в модалке
                setTimeout(() => {
                    const isNowInFav = favorites.some(item => item.id === productId);
                    if (isNowInFav) {
                        this.innerHTML = '<i class="fas fa-heart"></i>';
                        this.classList.add('active');
                    } else {
                        this.innerHTML = '<i class="far fa-heart"></i>';
                        this.classList.remove('active');
                    }
                }, 100);
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeProductDetailsModal);
        }
        
        // Обработчик для оверлея
        overlay.addEventListener('click', closeProductDetailsModal);
        
        // Обработчик клавиши ESC
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                closeProductDetailsModal();
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Сохраняем обработчик для удаления
        modal._escHandler = escHandler;
    }, 20);
}

function closeProductDetailsModal() {
    const modal = document.getElementById('productDetailsModal');
    const overlay = document.getElementById('productModalOverlay');
    
    if (modal) {
        modal.classList.remove('show');
        // Удаляем обработчик ESC
        if (modal._escHandler) {
            document.removeEventListener('keydown', modal._escHandler);
        }
    }
    
    if (overlay) {
        overlay.classList.remove('show');
    }
    
    document.body.style.overflow = 'auto';
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

function openContactPopup() {
    document.getElementById('contactPopup').classList.add('show');
    document.getElementById('overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeContactPopup() {
    document.getElementById('contactPopup').classList.remove('show');
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
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => {
        n.classList.remove('show');
        setTimeout(() => {
            if (n.parentNode) {
                n.parentNode.removeChild(n);
            }
        }, 300);
    });
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
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
    
    document.body.appendChild(notification);
    
    // Показываем с задержкой
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
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
            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                if (this.value.trim() === '') {
                    filteredProducts = [...allProducts];
                    currentPage = 1;
                    renderProducts();
                }
            }, 500);
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
    
    // Иконки в хедере
    document.getElementById('headerFavBtn')?.addEventListener('click', openFavoritesPopup);
    document.getElementById('headerCartBtn')?.addEventListener('click', openCartPopup);
    
    // Нижнее меню
    document.getElementById('navFavorites')?.addEventListener('click', openFavoritesPopup);
    document.getElementById('navCart')?.addEventListener('click', openCartPopup);
    document.getElementById('navFilter')?.addEventListener('click', openFilterPopup);
    document.getElementById('navContact')?.addEventListener('click', openContactPopup);
    
    // Кнопка "Перейти в каталог" в пустом избранном
    document.getElementById('browseBtn')?.addEventListener('click', function() {
        closeFavoritesPopup();
        resetFilters();
    });
    
    // Закрытие попапов
    document.getElementById('closeCart')?.addEventListener('click', closeCartPopup);
    document.getElementById('closeFav')?.addEventListener('click', closeFavoritesPopup);
    document.getElementById('closeFilter')?.addEventListener('click', closeFilterPopup);
    document.getElementById('closeContact')?.addEventListener('click', closeContactPopup);
    
    // Оверлей для закрытия попапов
    document.getElementById('overlay')?.addEventListener('click', function() {
        closeCartPopup();
        closeFavoritesPopup();
        closeFilterPopup();
        closeContactPopup();
        closeProductDetailsModal();
    });
    
    // Оформление заказа
    document.getElementById('checkoutBtn')?.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Добавьте товары в корзину', 'info');
            return;
        }
        
        // Проверяем адрес доставки
        if (!savedAddress || !savedAddress.street) {
            showNotification('Пожалуйста, укажите адрес доставки', 'warning');
            return;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = cart.reduce((sum, item) => {
            if (item.oldPrice > 0) {
                return sum + ((item.oldPrice - item.price) * item.quantity);
            }
            return sum;
        }, 0);
        const deliveryCost = updateDeliveryCost();
        const total = subtotal - discount + deliveryCost;
        
        const orderItems = cart.map(item => 
            `${item.name} - ${item.quantity} × ${item.price.toLocaleString()}₽ = ${(item.price * item.quantity).toLocaleString()}₽`
        ).join('\n');
        
        const orderText = `
📨 **Новый заказ в Aura Atelier**

📦 **Товары:**
${orderItems}

🏠 **Адрес доставки:**
${savedAddress.street}, д. ${savedAddress.house}${savedAddress.apartment ? `, кв. ${savedAddress.apartment}` : ''}${savedAddress.intercom ? ` (домофон: ${savedAddress.intercom})` : ''}
${savedAddress.comment ? `💬 Комментарий: ${savedAddress.comment}` : ''}

🧾 **Итого:** ${total.toLocaleString()}₽
📅 **Дата:** ${new Date().toLocaleString('ru-RU')}
        `.trim();
        
        // Если в Telegram, отправляем через WebApp
        if (tg.sendData) {
            const orderData = {
                userId: user.id,
                username: user.username,
                items: cart,
                address: savedAddress,
                total: total,
                timestamp: new Date().toISOString()
            };
            
            tg.sendData(JSON.stringify(orderData));
            tg.showAlert(`Заказ оформлен!\n\nСумма: ${total.toLocaleString()}₽\nТоваров: ${cart.length}\nАдрес: ${savedAddress.street}, д. ${savedAddress.house}\n\nС вами свяжется менеджер для подтверждения.`);
        } else {
            // Вне Telegram - открываем ссылку с предзаполненным сообщением
            const telegramUrl = `https://t.me/Ayder505?text=${encodeURIComponent(orderText)}`;
            window.open(telegramUrl, '_blank');
            showNotification(`Заказ на ${total.toLocaleString()}₽ отправлен менеджеру`, 'success');
        }
        
        // Очищаем корзину
        cart = [];
        saveToStorage(STORAGE_KEYS.CART, cart);
        updateCounters();
        updateCartPopup();
        renderProducts();
        
        closeCartPopup();
    });
    
    // Отправка сообщения в попапе контактов
    document.getElementById('sendMessageBtn')?.addEventListener('click', function() {
        const message = document.getElementById('contactMessage').value.trim();
        if (!message) {
            showNotification('Введите сообщение', 'warning');
            return;
        }
        
        const fullMessage = `Сообщение от пользователя:\n\n${message}`;
        const telegramUrl = `https://t.me/Ayder505?text=${encodeURIComponent(fullMessage)}`;
        window.open(telegramUrl, '_blank');
        
        document.getElementById('contactMessage').value = '';
        showNotification('Сообщение готово к отправке', 'success');
        closeContactPopup();
    });
    
    // Обработка кликов по кнопкам в карточках товаров
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
    
    // Кнопки фильтров
    document.getElementById('applyFilterBtn')?.addEventListener('click', function() {
        filterProducts();
        closeFilterPopup();
        showNotification('Фильтры применены', 'success');
    });
    
    document.getElementById('resetFilterBtn')?.addEventListener('click', resetFilters);
    
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
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCartPopup();
            closeFavoritesPopup();
            closeFilterPopup();
            closeContactPopup();
            closeProductDetailsModal();
        }
    });
}

// ===== ГЛОБАЛЬНЫЙ ЭКСПОРТ ДЛЯ ОТЛАДКИ =====
window.app = {
    user,
    allProducts,
    cart,
    favorites,
    filteredProducts,
    savedAddress,
    filterProducts,
    toggleCart,
    toggleFavorite,
    resetFilters,
    openCartPopup,
    openFavoritesPopup,
    openFilterPopup,
    openContactPopup,
    closeProductDetailsModal
};

console.log('Aura Atelier приложение инициализировано');