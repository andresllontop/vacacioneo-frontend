function closeSession() {
  let keys = keysCOOKIES();
  for (let i = 0; i < keys.length; i++) {
    Cookies.remove(keys[i]);
  }
  //REDIRECCIONAMOS EL LOGIN
  location.href = getHostFrontEnd() + "home";
}
function keysCOOKIES() {
  var keys = ['vacacioneo_token', 'vacacioneo_user'];
  return keys;
}

function parseJwt(token) {
  try {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    JSON.parse(window.atob(base64));

    return true;
  } catch (error) {
    //console.log('Error el token no es valido');
    return true;
  }
  //return JSON.parse(window.atob(base64));
}

function setCookieSession(token, user) {

  Cookies.set('vacacioneo_token', token);
  Cookies.set('vacacioneo_user', user);
}

function sendIndex() {
  let user = Cookies.getJSON('vacacioneo_user');

  if (user == undefined) {
    closeSession();
    return;
  }

  switch (parseInt(user.tipo_usuario)) {
    case 1:
      //APP
      location.href = getHostFrontEnd() + 'app/index';
      break;

      break;
  }
}



function setUrlFotoUserSession(url_foto) {
  document.querySelectorAll('.dt-avatar').forEach((img) => {
    img.setAttribute('src', url_foto);
  });
}
