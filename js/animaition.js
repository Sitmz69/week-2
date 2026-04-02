const burgerBtn = document.getElementById('burgerBtn');
const menu = document.getElementById('menu');

if (burgerBtn && menu) {
  burgerBtn.addEventListener('click', () => {
    menu.classList.toggle('menu--open');
    burgerBtn.classList.toggle('burger--active');
  });
}

window.addEventListener('scroll', function() {
  var btn = document.querySelector('.to-top-btn');
  if (window.pageYOffset > 300) {
    btn.classList.add('show');
  } else {
    btn.classList.remove('show');
  }
});

const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close');

const form = document.getElementById('contactForm');
const formError = document.getElementById('formError');

let lastSubmit = 0;

openBtn.onclick = () => modal.style.display = 'block';

closeBtn.onclick = () => modal.style.display = 'none';

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
};

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const message = document.getElementById('message');

  formError.innerHTML = '';
  [name, email, phone, message].forEach(el => el.classList.remove('error-field'));

  let errors = [];

  const nameValue = name.value.trim();
  const parts = nameValue.split(' ');

  if (parts.length === 1) {
    if (!/^[A-Za-zА-Яа-я_-]+$/.test(nameValue)) {
      errors.push('Имя: только буквы, "-" и "_"');
      name.classList.add('error-field');
    }
  } else if (parts.length >= 2 && parts.length <= 3) {
    for (let p of parts) {
      if (!/^[A-Za-zА-Яа-я_]+$/.test(p)) {
        errors.push('ФИО: только буквы и "_"');
        name.classList.add('error-field');
        break;
      }
    }
  } else {
    errors.push('Введите имя или ФИО (2-3 слова)');
    name.classList.add('error-field');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.push('Некорректный email');
    email.classList.add('error-field');
  }

  const digits = phone.value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    errors.push('Телефон: 10-15 цифр');
    phone.classList.add('error-field');
  }

  if (message.value.trim() === '') {
    errors.push('Введите сообщение');
    message.classList.add('error-field');
  }

  if (message.value.length > 500) {
    errors.push('Сообщение слишком длинное');
    message.classList.add('error-field');
  }

  if (Date.now() - lastSubmit < 5000) {
    errors.push('Подождите перед повторной отправкой');
  }

  if (errors.length > 0) {
    formError.innerHTML = errors.join('<br>');
    return;
  }

  lastSubmit = Date.now();

  function sanitize(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const safeMessage = sanitize(message.value);

  console.log({
    name: name.value,
    email: email.value,
    phone: phone.value,
    message: safeMessage
  });

  modal.style.display = 'none';
  showSuccessMessage('Форма успешно отправлена!');
  form.reset();
});

function showSuccessMessage(text) {
  const div = document.createElement('div');

  div.textContent = text;
  div.style.position = 'fixed';
  div.style.bottom = '20px';
  div.style.right = '20px';
  div.style.background = '#28a745';
  div.style.color = '#fff';
  div.style.padding = '15px';
  div.style.borderRadius = '8px';

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}