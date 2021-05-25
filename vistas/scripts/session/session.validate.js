let user_session;
let contextPah = getHostFrontEnd();
document.addEventListener("DOMContentLoaded", function () {
  if (Cookies.get("vacacioneo_token") === undefined) {
    location.href = contextPah + "home";
  } else if (parseJwt(Cookies.get("vacacioneo_token"))) {
    //CARGAMOS LOS DATOS DEL USUARIO
    user_session = Cookies.getJSON('vacacioneo_user');
    let user = user_session;
    //SET DATOS USER
    document.querySelectorAll('.name-user-session').forEach(element => {
      element.innerHTML = getStringCapitalize(user.usuario.split(" ")[0].toLowerCase());

    });
    document.querySelectorAll('.name-type-user-session').forEach(element => {
      element.innerHTML = getStringTipoUsuario(user.tipo_usuario);
    });
    let url_foto;
    if (user.foto != "" && user.foto != null) {
      url_foto = getHostFrontEnd() + "adjuntos/clientes/" + user.foto;
    } else {
      url_foto = getHostFrontEnd() + "vistas/assets/img/uservacacioneo.png";
    }
    setUrlFotoUserSession(url_foto);
    //ADD ITEMS MENU AL SIDEBAR
    addMenus(user);
  } else {
    closeSession();
  }

});

function getStringTipoUsuario(tipo_usuario) {
  let st = "";
  switch (tipo_usuario) {
    case 1:
      st = "ADMINISTRADOR";
      break;
    default:
      st = "USER";
      break;
  }
  //st = getStringCapitalize(st.toLowerCase());
  return st;
}

function addMenus() {
  //console.log(usuario.tipo_usuario);
  switch (parseInt(user_session.tipo_usuario)) {
    case 1:
      //vacacioneo
      createHTML_vacacioneo(parseInt(user_session.tipo_perfil));
      break;
    default:
      break;

  }
}

function createHTML_vacacioneo(typeProfile) {
  let row = "";
  if (typeProfile == 0) {
    row += `
    
    <ul data-menu="main" class="menu__level" tabindex="-1" role="menu" aria-label="All">
            <li class="menu__item" role="menuitem"><a class="menu__link" data-submenu="departamento"
                    aria-owns="departamento" href="#">DEPARTAMENTOS</a></li>
            <li class="menu__item" role="menuitem"><a class="menu__link" data-submenu="hotel" aria-owns="hotel"
                    href="#">HOTELES</a></li>
            <li class="menu__item" role="menuitem"><a class="menu__link" href="${getHostFrontEnd()}app/servicio">SERVICIOS</a></li>

        </ul>
        <!-- Submenu 1 -->
        <ul data-menu="departamento" id="departamento" class="menu__level" tabindex="-1" role="menu"
            aria-label="Departamentos">
            <li class="menu__item" role="menuitem"><a class="menu__link" href="${getHostFrontEnd()}app/departamento">Lista</a></li>
            <li class="menu__item" role="menuitem"><a class="menu__link" href="${getHostFrontEnd()}app/ciudad">Ciudades</a></li>
        </ul>
        <!-- Submenu 1-1 -->
        <!-- Submenu 2 -->
        <ul data-menu="hotel" id="hotel" class="menu__level" tabindex="-1" role="menu" aria-label="hotel">
            <li class="menu__item" role="menuitem"><a class="menu__link" href="${getHostFrontEnd()}app/hotel">Lista</a></li>
            <li class="menu__item" role="menuitem"><a class="menu__link" href="${getHostFrontEnd()}app/hotel/detalle">Detalle</a></li>

        </ul>
    `;
  }
  document.querySelector("#menus_vacacioneo").innerHTML = row;
  //include_script(getHostFrontEnd() + "vistas/js/main-app.js?v=0.22");
  eventoNavMenu();

}

function eventoNavMenu() {
  var menuEl = document.getElementById('ml-menu'),
    mlmenu = new MLMenu(menuEl, {
      // breadcrumbsCtrl : true, // show breadcrumbs
      initialBreadcrumb: 'SERVICIOS', // initial breadcrumb text
      backCtrl: false, // show back button
      // itemsDelayInterval : 60, // delay between each menu item sliding animation
      onItemClick: loadDummyData // callback: item that doesn´t have a submenu gets clicked - onItemClick([event], [inner HTML of the clicked item])
    });

  // mobile menu toggle
  var openMenuCtrl = document.querySelector('.action--open'),
    closeMenuCtrl = document.querySelector('.action--close');

  openMenuCtrl.addEventListener('click', openMenu);
  closeMenuCtrl.addEventListener('click', closeMenu);

  function openMenu() {
    classie.add(menuEl, 'menu--open');
    closeMenuCtrl.focus();
  }

  function closeMenu() {
    classie.remove(menuEl, 'menu--open');
    openMenuCtrl.focus();
  }

  // simulate grid content loading
  var gridWrapper = document.querySelector('.content');

  function loadDummyData(ev, itemName) {
    ev.preventDefault();

    closeMenu();

    classie.add(gridWrapper, 'content--loading');

    location.href = ev.target.href;
    setTimeout(function () {
      classie.remove(gridWrapper, 'content--loading');
      gridWrapper.innerHTML = '';
    }, 700);
  }

}


