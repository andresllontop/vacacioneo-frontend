/*HOST BACKEND */
function getHostAPI() {
  return "http://localhost:8080/" + getContextAPI() + "api/";
}

/* HOST FRONTED*/
function getContextAPP() {
  return 'vacacioneo-frontend/';
  ;
}
/* */
function getContextAPI() {
  return 'vacacioneo-backend/';
  //  return '';
}

function getHostFrontEnd() {
  return 'http://localhost/' + getContextAPP();
}


