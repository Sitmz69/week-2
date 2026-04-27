(function() {
    'use strict'; // Включение строгого режима JavaScript

    const chatToggleBtn = document.getElementById('chatToggleBtn'); // Кнопка открытия/закрытия чата
    const chatWindow = document.getElementById('chatWindow'); // Окно чата
    const chatMessages = document.getElementById('chatMessages'); // Контейнер сообщений
    const chatInput = document.getElementById('chatInput'); // Поле ввода
    const chatSendBtn = document.getElementById('chatSendBtn'); // Кнопка отправки
    const chatCloseBtn = document.getElementById('chatCloseBtn'); // Кнопка закрытия
    const chatClearBtn = document.getElementById('chatClearBtn'); // Кнопка очистки
    const chatBadge = document.getElementById('chatBadge'); // Индикатор непрочитанных сообщений

    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || []; // Загрузка истории из localStorage
    let isOpen = false; // Флаг состояния чата (открыт/закрыт)
    let unreadCount = 0; // Счётчик непрочитанных сообщений

    const botResponses = [ // Массив возможных ответов бота
        {
            keywords: ['привет', 'здравствуй', 'добрый', 'хай', 'hello', 'hi'], // Ключевые слова
            response: 'Здравствуйте! 👋 Чем могу помочь?' // Ответ
        },
        {
            keywords: ['услуг', 'ремонт', 'диагност', 'чистк', 'обслужив'],
            response: 'У нас есть:\n• Диагностика — от 50руб\n• Ремонт — от 120руб\n• Чистка — от 90руб\n• Обслуживание — от 100руб\n\nЧто вас интересует?'
        },
        {
            keywords: ['товар', 'купить', 'диск', 'видеокарт', 'плат', 'память', 'термопаст'],
            response: 'В наличии:\n• Жёсткий диск Samsung 1TB — 250руб\n• Термопаста MX-6 — 40руб\n• Оперативная память Kingston 16Gb — 125руб\n• Видеокарта Nvidia — 1250руб\n• Материнская плата Asus B650 — 850руб\n\nЧто нужно?'
        },
        {
            keywords: ['цен', 'стоим', 'прайс', 'скольк', 'дорог', 'дёшев'],
            response: '💰 Цены:\n\nУслуги:\n• Диагностика — от 50руб\n• Ремонт — от 120руб\n• Чистка — от 90руб\n\nТовары:\n• Термопаста — от 40руб\n• Видеокарта — до 1250руб'
        },
        {
            keywords: ['контакт', 'телефон', 'email', 'адрес', 'почт', 'позвон', 'написат'],
            response: '📞 Контакты:\n\n• Телефон: +375(25)755-хх-хх (24/7)\n• Email: servers@gmail.com\n• Адрес: ул.Пушкина д.32'
        },
        {
            keywords: ['помощ', 'помог', 'что уме', 'возможн'],
            response: 'Я могу рассказать:\n💻 — об услугах\n🛒 — о товарах\n💰 — о ценах\n📞 — о контактах\n\nПросто спросите!'
        },
        {
            keywords: ['спасиб', 'благодар'],
            response: 'Пожалуйста! 😊 Если будут ещё вопросы — обращайтесь!'
        },
        {
            keywords: ['пока', 'до свидани', 'до встреч'],
            response: 'До свидания! 👋 Хорошего дня!'
        }
    ];

    const defaultResponse = 'Извините, я не совсем понял. 🤔 Попробуйте спросить об услугах, товарах, ценах или контактах.'; // Ответ по умолчанию

    function addMessage(text, type) { // Функция добавления сообщения
        const messageEl = document.createElement('div'); // Создание элемента div
        messageEl.classList.add('message', `message-${type}`); // Добавление CSS-классов
        messageEl.textContent = text; // Установка текста сообщения
        chatMessages.appendChild(messageEl); // Добавление в DOM
        scrollToBottom(); // Прокрутка вниз

        chatHistory.push({ text, type, time: Date.now() }); // Добавление в историю
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory)); // Сохранение в localStorage
    }

    function scrollToBottom() { // Прокрутка к последнему сообщению
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(userMessage) { // Получение ответа бота
        const lowerMessage = userMessage.toLowerCase(); // Приведение к нижнему регистру

        for (const item of botResponses) { // Перебор всех шаблонов
            for (const keyword of item.keywords) { // Перебор ключевых слов
                if (lowerMessage.includes(keyword)) { // Проверка наличия слова
                    return item.response; // Возврат найденного ответа
                }
            }
        }

        return defaultResponse; // Возврат ответа по умолчанию
    }

    function showTyping() { // Показ индикатора "печатает"
        const typingEl = document.createElement('div'); // Создание элемента
        typingEl.classList.add('typing-indicator'); // Добавление класса
        typingEl.id = 'typingIndicator'; // Установка ID
        typingEl.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>'; // HTML анимации
        chatMessages.appendChild(typingEl); // Добавление в чат
        scrollToBottom(); // Прокрутка
    }

    function hideTyping() { // Удаление индикатора
        const typingEl = document.getElementById('typingIndicator'); // Поиск элемента
        if (typingEl) typingEl.remove(); // Удаление, если найден
    }

    function sendMessage() { // Отправка сообщения
        const text = chatInput.value.trim(); // Получение текста без пробелов
        if (!text) return; // Проверка на пустое сообщение

        addMessage(text, 'user'); // Добавление сообщения пользователя
        chatInput.value = ''; // Очистка поля
        chatInput.style.height = 'auto'; // Сброс высоты поля

        showTyping(); // Показ индикатора

        const delay = Math.random() * 700 + 800; // Случайная задержка ответа

        setTimeout(() => { // Таймер задержки
            hideTyping(); // Удаление индикатора

            const botResponse = getBotResponse(text); // Получение ответа
            addMessage(botResponse, 'bot'); // Добавление ответа

            if (!isOpen) { // Если чат закрыт
                unreadCount++; // Увеличение счётчика
                updateBadge(); // Обновление индикатора
            }
        }, delay);
    }

    function updateBadge() { // Обновление бейджа
        if (unreadCount > 0) { // Если есть непрочитанные
            chatBadge.textContent = unreadCount; // Установка числа
            chatBadge.style.display = 'flex'; // Показ
        } else {
            chatBadge.style.display = 'none'; // Скрытие
        }
    }

    function openChat() { // Открытие чата
        isOpen = true; // Установка состояния
        chatWindow.classList.add('chat-open'); // Добавление класса
        unreadCount = 0; // Сброс счётчика
        updateBadge(); // Обновление бейджа
        chatInput.focus(); // Фокус на вводе
        scrollToBottom(); // Прокрутка
    }

    function closeChat() { // Закрытие чата
        isOpen = false; // Смена состояния
        chatWindow.classList.remove('chat-open'); // Удаление класса
    }

    function clearHistory() { // Очистка истории
        chatHistory = []; // Очистка массива
        localStorage.removeItem('chatHistory'); // Удаление из localStorage
        chatMessages.innerHTML = ''; // Очистка интерфейса
        addMessage('История очищена. Чем могу помочь?', 'bot'); // Сообщение от бота
    }

    function renderHistory() { // Отрисовка истории
        chatMessages.innerHTML = ''; // Очистка контейнера

        if (chatHistory.length === 0) { // Если истории нет
            addMessage('Привет! 👋 Я чат-помощник. Спросите об услугах, товарах, ценах или контактах.', 'bot');
        } else {
            chatHistory.forEach(msg => { // Перебор сообщений
                const messageEl = document.createElement('div'); // Создание элемента
                messageEl.classList.add('message', `message-${msg.type}`); // Классы
                messageEl.textContent = msg.text; // Текст
                chatMessages.appendChild(messageEl); // Добавление
            });
            scrollToBottom(); // Прокрутка
        }
    }

    function autoResize() { // Авто-изменение размера поля ввода
        chatInput.style.height = 'auto'; // Сброс высоты
        chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px'; // Ограничение до 100px
    }

    chatToggleBtn.addEventListener('click', () => { // Обработчик кнопки открытия/закрытия
        if (isOpen) {
            closeChat(); // Закрытие
        } else {
            openChat(); // Открытие
        }
    });

    chatCloseBtn.addEventListener('click', closeChat); // Закрытие по кнопке
    chatClearBtn.addEventListener('click', clearHistory); // Очистка истории
    chatSendBtn.addEventListener('click', sendMessage); // Отправка по кнопке

    chatInput.addEventListener('keydown', (e) => { // Обработка нажатия клавиш
        if (e.key === 'Enter' && !e.shiftKey) { // Enter без Shift
            e.preventDefault(); // Отмена переноса строки
            sendMessage(); // Отправка сообщения
        }
    });

    chatInput.addEventListener('input', autoResize); // Авто-ресайз поля

    renderHistory(); // Инициализация чата при загрузке
})();