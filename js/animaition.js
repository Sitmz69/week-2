const burgerBtn = document.getElementById('burgerBtn'); // Получаем кнопку "бургер-меню"
const menu = document.getElementById('menu'); // Получаем само меню

if (burgerBtn && menu) { // Проверяем, существуют ли элементы
  burgerBtn.addEventListener('click', () => { // Обработчик клика по кнопке
    menu.classList.toggle('menu--open'); // Переключаем класс открытия меню
    burgerBtn.classList.toggle('burger--active'); // Меняем внешний вид кнопки (анимация)
  });
}

const themeToggle = document.querySelector('.checkbox'); // Получаем переключатель темы
const html = document.documentElement; // Получаем корневой элемент <html>

const savedTheme = localStorage.getItem('theme'); // Читаем сохранённую тему из localStorage
if (savedTheme === 'light') { // Если тема была светлая
  html.setAttribute('data-theme', 'light'); // Устанавливаем атрибут для светлой темы
  if (themeToggle) {
    themeToggle.checked = true; // Включаем чекбокс
  }
}

if (themeToggle) { // Если переключатель существует
  themeToggle.addEventListener('change', () => { // Событие изменения чекбокса
    if (themeToggle.checked) { // Если включён
      html.setAttribute('data-theme', 'light'); // Устанавливаем светлую тему
      localStorage.setItem('theme', 'light'); // Сохраняем в localStorage
    } else {
      html.removeAttribute('data-theme'); // Убираем атрибут (возвращаем тёмную тему)
      localStorage.setItem('theme', 'dark'); // Сохраняем тёмную тему
    }
  });
}

window.addEventListener('scroll', function() { // Событие прокрутки страницы
  var btn = document.querySelector('.to-top-btn'); // Получаем кнопку "наверх"
  if (window.pageYOffset > 300) { // Если прокрутили больше чем на 300px
    btn.classList.add('show'); // Показываем кнопку
  } else {
    btn.classList.remove('show'); // Иначе скрываем
  }
});

const modal = document.getElementById('modal'); // Модальное окно
const openBtn = document.getElementById('openModalBtn'); // Кнопка открытия модального окна
const closeBtn = document.querySelector('.close'); // Кнопка закрытия

const form = document.getElementById('contactForm'); // Форма обратной связи
const formError = document.getElementById('formError'); // Блок для ошибок

let lastSubmit = 0; // Время последней отправки формы

openBtn.onclick = () => modal.style.display = 'block'; // Открытие модального окна

closeBtn.onclick = () => modal.style.display = 'none'; // Закрытие по кнопке

window.onclick = (e) => { // Обработчик клика по окну
  if (e.target === modal) { // Если кликнули вне содержимого (по фону)
    modal.style.display = 'none'; // Закрываем окно
  }
};

form.addEventListener('submit', function(e) { // Обработчик отправки формы
  e.preventDefault(); // Отменяем стандартную отправку

  const name = document.getElementById('name'); // Поле имени
  const email = document.getElementById('email'); // Поле email
  const phone = document.getElementById('phone'); // Поле телефона
  const message = document.getElementById('message'); // Поле сообщения

  formError.innerHTML = ''; // Очищаем предыдущие ошибки
  [name, email, phone, message].forEach(el => el.classList.remove('error-field')); // Убираем подсветку ошибок

  let errors = []; // Массив для хранения ошибок

  const nameValue = name.value.trim(); // Получаем значение имени без пробелов
  const parts = nameValue.split(' '); // Разбиваем по пробелу (для ФИО)

  if (parts.length === 1) { // Если введено одно слово (имя)
    if (!/^[A-Za-zА-Яа-я_-]+$/.test(nameValue)) { // Проверка на допустимые символы
      errors.push('Имя: только буквы, "-" и "_"'); // Добавляем ошибку
      name.classList.add('error-field'); // Подсвечиваем поле
    }
  } else if (parts.length >= 2 && parts.length <= 3) { // Если ФИО (2-3 слова)
    for (let p of parts) { // Проверяем каждую часть
      if (!/^[A-Za-zА-Яа-я_]+$/.test(p)) { // Проверка символов
        errors.push('ФИО: только буквы и "_"'); // Ошибка
        name.classList.add('error-field'); // Подсветка
        break; // Прерываем цикл
      }
    }
  } else {
    errors.push('Введите имя или ФИО (2-3 слова)'); // Общая ошибка
    name.classList.add('error-field'); // Подсветка
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { // Проверка email
    errors.push('Некорректный email');
    email.classList.add('error-field');
  }

  const digits = phone.value.replace(/\D/g, ''); // Удаляем всё кроме цифр
  if (digits.length < 10 || digits.length > 15) { // Проверка длины номера
    errors.push('Телефон: 10-15 цифр');
    phone.classList.add('error-field');
  }

  if (message.value.trim() === '') { // Проверка на пустое сообщение
    errors.push('Введите сообщение');
    message.classList.add('error-field');
  }

  if (message.value.length > 500) { // Проверка длины сообщения
    errors.push('Сообщение слишком длинное');
    message.classList.add('error-field');
  }

  if (Date.now() - lastSubmit < 5000) { // Проверка на частые отправки (анти-спам)
    errors.push('Подождите перед повторной отправкой');
  }

  if (errors.length > 0) { // Если есть ошибки
    formError.innerHTML = errors.join('<br>'); // Выводим их
    return; // Прерываем выполнение
  }

  lastSubmit = Date.now(); // Обновляем время последней отправки

  function sanitize(str) { // Функция защиты от HTML-инъекций
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const safeMessage = sanitize(message.value); // Очищаем сообщение

  console.log({ // Выводим данные в консоль (имитация отправки)
    name: name.value,
    email: email.value,
    phone: phone.value,
    message: safeMessage
  });

  modal.style.display = 'none'; // Закрываем модальное окно
  showSuccessMessage('Форма успешно отправлена!'); // Показываем уведомление
  form.reset(); // Очищаем форму
});

function showSuccessMessage(text) { // Функция показа уведомления
  const div = document.createElement('div'); // Создаём элемент

  div.textContent = text; // Устанавливаем текст
  div.style.position = 'fixed'; // Фиксированное положение
  div.style.bottom = '20px'; // Отступ снизу
  div.style.right = '20px'; // Отступ справа
  div.style.background = '#28a745'; // Цвет фона (зелёный)
  div.style.color = '#fff'; // Цвет текста (белый)
  div.style.padding = '15px'; // Внутренние отступы
  div.style.borderRadius = '8px'; // Скругление углов

  document.body.appendChild(div); // Добавляем на страницу

  setTimeout(() => div.remove(), 3000); // Удаляем через 3 секунды
}