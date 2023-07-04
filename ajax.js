$(document).ready(function () {

    $("#btn").click(
        function () {
            // test email
            var fieldemail = $('input[name="email"]').val();
            if (!checkmail(fieldemail)) {
                return false;
            };
            // test password
            var fieldpass = $('input[name="password"]').val();
            var fieldpass1 = $('input[name="password1"]').val();
            if (!checkpass(fieldpass, fieldpass1)){
                return false;
            }

            // serialize form to str
            serialize_form = jQuery('#ajax_form').serializeArray();
            string_form = form_to_str(serialize_form);
            // hash serialize form
            salt = '123'
            hash_form = hash(string_form, salt);

            // serialize form
            data = jQuery("#" + 'ajax_form').serialize() +'&hash='+ hash_form;
            sendAjaxForm('result_form', data, 'action_ajax_form.php');
            return true;
        }
    );
});


function sendAjaxForm(result_form, data, url) {
    jQuery.ajax({

        url: url, // url страницы
        type: "POST", // метод отправки
        dataType: "json", // формат данных
        data: data,  // данные для отправки
        success: function (response) { // Данные отправлены успешно
            document.getElementById(result_form).innerHTML = "Ответ: " + response.name;
            // Прячем форму
            $('#ajax_form').css('display','none');
        },
        error: function (response) { // Данные не отправлены
            document.getElementById(result_form).innerHTML = "Ошибка. Данные не отправленны.";
        }
    });
}

// test email
function checkmail(txt)
{
if (txt == "") {
	alert("Введите Адрес электронной почты.");
	return false
	}
if (txt.indexOf(".") == -1) {
	alert("В электронной почте нет символа\".\"");
	return false
	}
if((txt.indexOf(",")>=0)||(txt.indexOf(";")>=0)||(txt.indexOf(" ")>=0)){
	alert("Адрес электронной почты был введен неправильно.");
	return false
	}
dog = txt.indexOf("@");
if (dog == -1) {
	alert("В электронной почте нет символа\"@\".");
	return false
	}
if ((dog < 1) || (dog > txt.length - 5)) {
	alert("Адрес электронной почты был введен неправильно.");
	return false
	}
if ((txt.charAt(dog - 1) == '.') || (txt.charAt(dog + 1) == '.')) {
    alert("Адрес электронной почты был введен неправильно.");
	return false
	}
return true
}

// test password
function checkpass(pass, pass1)
{
    // console.log(pass);
    if ((pass !== pass1) || (pass.length < 1)) {
        alert("Пароли не совпадают");
        return false;
    }
return true;
}

// hash simulation
function hash (str, sol) {
    // функция для создания хэша из строки + соли
    return sol+'{'+str+'}';
}

// convert serialize_form to string
function form_to_str(serialize_form){
    str_form = '';
    jQuery.each(serialize_form, function(){
        str_form += this.name +':'+ this.value +',';
    });

    return str_form;
}