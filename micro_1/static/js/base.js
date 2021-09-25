document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});

function showLanguages() {
  var x = document.getElementById("languages");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function formatar_nome_gym(campo_texto) {
  var invalid_name = document.getElementById('invalid_name');
  if (campo_texto.value.length <= 5) {
    campo_texto.classList.remove('is-success');
    campo_texto.classList.add('is-danger');
    invalid_name.classList.remove('is-hidden');
    return false;
  }
  campo_texto.classList.remove('is-danger');
  campo_texto.classList.add('is-success');
  invalid_name.classList.add('is-hidden');
  return true;
}

function formatar_cpf_cnpj(campo_texto) {
  var valido;
  if (campo_texto.value.length <= 11) {
    campo_texto.value = mascara_cpf(campo_texto.value).trim();
    valido = valida_cpf(campo_texto.value);
  } else {
    campo_texto.value = mascara_cnpj(campo_texto.value).trim();
    valido = validar_cnpj(campo_texto.value);
  }
  if (!valido) {
    campo_texto.classList.remove('is-success');
    campo_texto.classList.add('is-danger');
  } else {
    campo_texto.classList.remove('is-danger');
    campo_texto.classList.add('is-success');
  }
  return valido;
}

function retirar_formatacao_cpf_cnpj(campo_texto) {
  campo_texto.value = campo_texto.value.replace(/(\.|\/|\-)/g, "");
}

function mascara_cpf(valor) {
  return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
}


function mascara_cnpj(valor) {
  return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
}

function validar_cnpj(cnpj) {

  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14)
    return false;

  // Elimina CNPJs invalidos conhecidos
  if (cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999")
    return false;

  // Valida DVs
  tamanho = cnpj.length - 2
  numeros = cnpj.substring(0, tamanho);
  digitos = cnpj.substring(tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0))
    return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1))
    return false;

  return true;

}

function valida_cpf(cpf) {
  if (typeof cpf !== "string") return false
  cpf = cpf.replace(/[\s.-]*/igm, '')
  if (
    !cpf ||
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  ) {
    return false
  }
  var soma = 0
  var resto
  for (var i = 1; i <= 9; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
  resto = (soma * 10) % 11
  if ((resto == 10) || (resto == 11)) resto = 0
  if (resto != parseInt(cpf.substring(9, 10))) return false
  soma = 0
  for (var i = 1; i <= 10; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
  resto = (soma * 10) % 11
  if ((resto == 10) || (resto == 11)) resto = 0
  if (resto != parseInt(cpf.substring(10, 11))) return false
  return true
}

function check_equal_password() {
  password = document.getElementById('password');
  password_confirm = document.getElementById('password_confirm');
  invalid_password_confirm_msg = document.getElementById('invalid_password_confirm_msg');
  submit_button = document.getElementById('submit_button');
  if (password_confirm.value == password.value && check_valid_password()) {
    password.classList.remove('is-danger');
    password_confirm.classList.remove('is-danger');
    password.classList.add('is-success');
    password_confirm.classList.add('is-success');
    invalid_password_confirm_msg.classList.add('is-hidden');
    submit_button.removeAttribute('disabled');
  } else {
    password.classList.remove('is-success');
    password_confirm.classList.remove('is-success');
    password.classList.add('is-danger');
    password_confirm.classList.add('is-danger');
    if (password_confirm.value != password.value) {
      invalid_password_confirm_msg.innerHTML = "As senhas não são iguais! Validar confirmação.";
    } else {

    }
    invalid_password_confirm_msg.classList.remove('is-hidden');
    submit_button.setAttribute('disabled', true);
  }
}

function check_valid_password() {
  var valid = true;
  password = document.getElementById('password');
  invalid_password_confirm_msg = document.getElementById('invalid_password_confirm_msg');
  invalid_password_confirm_msg.innerHTML = "A Senha precisa conter:";
  // Validate lowercase letters
  var lower_case_letters = /[a-z]/g;
  if (!password.value.match(lower_case_letters)) {
    valid = false;
    invalid_password_confirm_msg.innerHTML += "<br> - pelomenos 1 caractere minúsculo!";
  }
  // Validate capital letters
  var upper_case_letters = /[A-Z]/g;
  if (!password.value.match(upper_case_letters)) {
    valid = false;
    invalid_password_confirm_msg.innerHTML += "<br> - pelomenos 1 caractere maiúsculo!";
  }
  // Validate numbers
  var numbers = /[0-9]/g;
  if (!password.value.match(numbers)) {
    valid = false;
    invalid_password_confirm_msg.innerHTML += "<br> - pelomenos 1 caractere numérico!";
  }
  // Validate length
  if (password.value.length <= 8) {
    valid = false;
    invalid_password_confirm_msg.innerHTML += "<br> - pelomenos 8 caracteres!";
  }
  // Validate special char
  var special_chars = /\W|_/g;
  if (!password.value.match(special_chars)) {
    valid = false;
    invalid_password_confirm_msg.innerHTML += "<br> - pelomenos 1 caractere especial!";
  }
  return valid;
}

function check_valid_username(el) {
  var valid_username = "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";
  if (!el.value.match(valid_username)) {
    document.getElementById('usuario_check_msg').innerHTML = "O Usuário deve ter mais de 8 caracteres: (números, letras e ._ )<br>Espaços e caracteres especiais não são permitidos!";
    el.classList.classList.remove('is-success');
    el.classList.classList.add('is-danger');
  }
  document.getElementById('usuario_check_msg').innerHTML = "";
}