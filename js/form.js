const form = document.querySelector('form');
const nameInput = form.querySelector('input[name="name"]');
const labelName = form.querySelector('label[for="name"]');
const phoneInput = form.querySelector('input[name="phone"]');
const labelPhone = form.querySelector('label[for="phone"]');
const checkbox = form.querySelector('input[name="checkbox"]');
const terms = form.querySelector('.terms');
const button = document.getElementById('submitForm');
const thankYou = document.querySelector('.thank-you');
const returnToForm = document.getElementById('returnToForm');

let isFormSubmitted = false;

button.setAttribute('disabled', 'disabled');

nameInput.addEventListener('input', () => {
  updateFormValidity();
  if (/[\d]/.test(nameInput.value)) {
    labelName.classList.add('error');
    nameInput.value = nameInput.value.replace(/\d/g, '');
  } else {
    labelName.classList.remove('error');
  }
});

function mask(event) {
  if (event) {
    const keyCode = event.keyCode || event.which;
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
}

phoneInput.addEventListener('input', mask);
phoneInput.addEventListener('focus', mask);
phoneInput.addEventListener('blur', mask);

phoneInput.addEventListener('input', () => {
  updateFormValidity();
  if (isFormSubmitted && phoneInput.value.replace(/\D/g, '').length === 11) {
    labelPhone.classList.remove('error');
  }
});

checkbox.addEventListener('input', () => {
  updateFormValidity();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  isFormSubmitted = true;
  updateFormValidity();

  if (nameInput.value.trim() === '') {
    event.preventDefault();
    labelName.classList.add('error');
    labelName.textContent = '*укажите пожалуйста свое имя';
    nameInput.focus();
  } else {
    labelName.classList.remove('error');
    labelName.textContent = ' *пожалуйста, используйте только буквы в поле "Имя"';
  }

  if (phoneInput.value.replace(/\D/g, '').length < 11) {
    event.preventDefault();
    labelPhone.classList.add('error');
    phoneInput.focus();
  } else {
    labelPhone.classList.remove('error');
  }

  if (!checkbox.checked) {
    event.preventDefault();
    terms.classList.add('error');
  } else {
    terms.classList.remove('error');
  }

  if (isFormSubmitted && nameInput.value.trim() && phoneInput.value.replace(/\D/g, '').length === 11 && checkbox.checked) {
    submitForm();
  }
});

returnToForm.addEventListener('click', () => {
  thankYou.classList.add('hidden');
  form.classList.remove('hidden');
  form.reset();
});

function updateFormValidity() {
  if (nameInput.value.trim() && !/[\d]/.test(nameInput.value)) {
    labelName.classList.remove('error');
  }

  if (isFormSubmitted && phoneInput.value.replace(/\D/g, '').length === 11) {
    labelPhone.classList.remove('error');
  }

  if (checkbox.checked) {
    terms.classList.remove('error');
  }
}

function submitForm() {
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
        <p><strong>Имя:</strong> ${nameInput.value}</p>
        <p><strong>Телефон:</strong> ${phoneInput.value}</p>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
