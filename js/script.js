const form = document.querySelector('form'),
  name = form.querySelector('input[name="name"]'),
  labelName = form.querySelector('label[for="name"]'),
  phone = form.querySelector('input[name="phone"]'),
  labelPhone = form.querySelector('label[for="phone"]'),
  checkbox = form.querySelector('input[name="checkbox"]'),
  terms = form.querySelector('.terms'),
  button = form.querySelector('button[type="submit"]'),
  thankYou = document.querySelector('.thank-you');
let keyCode;
let nameValid = false;
let phoneValid = false;
let checkboxValid = false;
let isFormSubmitted = false;

// button.setAttribute('disabled', 'disabled');

name.addEventListener('input', () => {
  if (name.value.trim() !== '') {
    button.removeAttribute('disabled')
    nameValid = true;
  } else {
    button.setAttribute('disabled', 'disabled');
    nameValid = false;
  }
  if (/[\d]/.test(name.value)) {
    labelName.classList.add('error');
    button.setAttribute('disabled', 'disabled');
    name.value = name.value.replace(/\d/g, '');
  } else {
    labelName.classList.remove('error');
  }
});

function mask(event) {
  if (event) {
    keyCode = event.keyCode || event.which;
  }
  const pos = this.selectionStart;

  if (pos < 3) event.preventDefault();

  const matrix = "+7 (___) ___ __ __";
  let i = 0;
  const def = matrix.replace(/\D/g, "");
  const val = this.value.replace(/\D/g, "");
  let new_value = matrix.replace(/[_\d]/g, function (a) {
    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
  });

  i = new_value.indexOf("_");
  if (i !== -1) {
    i < 5 && (i = 3);
    new_value = new_value.slice(0, i);
  }

  const reg = matrix.substr(0, this.value.length).replace(/_+/g,
    function (a) {
      return "\\d{1," + a.length + "}";
    }).replace(/[+()]/g, "\\$&");
  const regex = new RegExp("^" + reg + "$");

  if (!regex.test(this.value) || this.value.length < 5 || (keyCode && keyCode > 47 && keyCode < 58)) this.value = new_value;

  if (event && event.type === "blur" && this.value.length < 5) this.value = "";
}
phone.addEventListener('input', mask);
phone.addEventListener('focus', mask);
phone.addEventListener('blur', mask);

phone.addEventListener('input', () => {
  // Проверка наличия ошибки только после отправки формы
  if (isFormSubmitted) {
    const phoneValue = phone.value.replace(/\D/g, '');

    if (phoneValue.length === 11) {
      labelPhone.classList.remove('error');
      button.removeAttribute('disabled');
      phoneValid = true;
    } else {
      labelPhone.classList.add('error');
      button.setAttribute('disabled', 'disabled');
      phoneValid = false;
    }
  }
});

checkbox.addEventListener('input', () => {
  if (checkbox.checked) {
    terms.classList.remove('error');
    button.removeAttribute('disabled');
    checkboxValid = true
  }
  else {
    terms.classList.add('error');
    button.setAttribute('disabled', 'disabled');
    checkboxValid = false
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  isFormSubmitted = true;
  if (phone.value.replace(/\D/g, '').length < 11) {
    event.preventDefault();
    labelPhone.classList.add('error');
    button.setAttribute('disabled', 'disabled');
    phone.focus();
    phoneValid = false;
  } else {
    labelPhone.classList.remove('error');
    button.removeAttribute('disabled');
    phoneValid = true;
  }
  if (name.value.trim() === '') {
    event.preventDefault();
    labelName.classList.add('error');
    labelName.textContent = '*укажите пожалуйста свое имя';
    button.setAttribute('disabled', 'disabled');
    name.focus();
    nameValid = false;
  } else {
    labelName.classList.remove('error');
    labelName.textContent = ' *пожалуйста, используйте только буквы в поле "Имя"';
    button.removeAttribute('disabled');
    nameValid = true;
  }
  if (!checkbox.checked) {
    event.preventDefault();
    terms.classList.add('error');
    button.setAttribute('disabled', 'disabled');
    checkboxValid = false;
  } else {
    terms.classList.remove('error');
    checkboxValid = true;
  }
  if (nameValid && phoneValid && checkboxValid) {
    button.removeAttribute('disabled');
    isFormSubmitted = false;

    const formData = new FormData(form);
    fetch('action.php', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);

        form.classList.add('hidden');
        thankYou.classList.remove('hidden');

        const submittedData = document.getElementById('submittedData');
        submittedData.innerHTML = `
                  <p><strong>Имя:</strong> ${name.value}</p>
                  <p><strong>Сайт компании:</strong> ${site.value}</p>
                  <p><strong>Телефон:</strong> ${phone.value}</p>
              `;
        form.reset();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
});

const returnToForm = document.getElementById('returnToForm');
thankYou.classList.add('hidden');
returnToForm.addEventListener('click', () => {
  thankYou.classList.add('hidden');
  form.classList.remove('hidden');
});