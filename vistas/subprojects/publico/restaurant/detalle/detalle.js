var beanPaginationDetalle;
var detalleSelected, restauranteSelected, contadorDetalle = 2, valorHover;
var beanRequestDetalle = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestDetalle.entity_api = 'comidas';
    beanRequestDetalle.operation = 'paginate';
    beanRequestDetalle.type_request = 'GET';
    let GETsearch = window.location.pathname;

    if (GETsearch.split("/").length == 5) {
        if (/^[0-9.]*$/.test(GETsearch.split("/")[4])) {
            restauranteSelected = { "idRestaurante": GETsearch.split("/")[4] };
            $('#modalCargandoDetalle').modal('show');

            /* */
        } else {
            window.location.href = getHostFrontEnd() + "restaurant";
        }

    } else {
        window.location.href = getHostFrontEnd() + "restaurant";
    }


    $("#modalCargandoDetalle").on('shown.bs.modal', function () {
        processAjax();
    });


});

function processAjax() {

    let parameters_pagination = '';

    switch (beanRequestDetalle.operation) {
        case "paginate":
            parameters_pagination +=
                '?idrestaurante=' + restauranteSelected.idRestaurante;
            parameters_pagination +=
                '&nombre=';
            parameters_pagination +=
                '&page=' + parseInt(document.querySelector("#pageComida").value.trim());
            parameters_pagination +=
                '&size=1'; break;
        case "get":
            parameters_pagination +=
                '/' + restauranteSelected.idRestaurante;
            document.querySelector('#tbodyRestaurante').innerHTML = `
                <div class="progress progress-striped active" style="margin-bottom: 0px;">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">
                                    Cargando Datos del Restaurante. . .
                                </div>
                            </div>
                `;
            break;
        default:
            parameters_pagination +=
                '/' + restauranteSelected.idRestaurante;
            document.querySelector('#tbodyCountCategoria').innerHTML = `
            <div class="progress progress-striped active" style="margin-bottom: 0px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">
                                Cargando Categoria. . .
                            </div>
                        </div>
            `;
            break;
    }

    $.ajax({
        url: getHostAPI() + beanRequestDetalle.entity_api + "/" + beanRequestDetalle.operation +
            parameters_pagination,
        type: beanRequestDetalle.type_request,
        json: null,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json'
    }).done(function (beanCrudResponse) {
        $('#modalCargandoDetalle').modal("hide");
        if (beanCrudResponse.beanPagination !== null) {

            if (beanRequestDetalle.operation == "paginate") {
                beanPaginationDetalle = beanCrudResponse.beanPagination;
                listaDetalle(beanPaginationDetalle);
            } else if (beanRequestDetalle.operation == "get") {
                beanPaginationDetalle = beanCrudResponse;
                listaRestaurante(beanPaginationDetalle);
            } else {
                beanPaginationDetalle = beanCrudResponse.beanPagination;
                countCategoria(beanPaginationDetalle);
            }


        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoDetalle').modal("hide");
    });

}

function EstadoDetalleServicio(key) {
    switch (key) {
        case 0:

            return "NO";
        case 1:

            return "SI";

        default:
            return "NO";
    }

}

function listaDetalle(beanPagination) {
    beanRequestDetalle.entity_api = 'restaurante';
    beanRequestDetalle.operation = 'get';
    beanRequestDetalle.type_request = 'GET';
    processAjax();
    let row = "";
    document.querySelector('#tbodyDetalle').innerHTML = "";
    if (beanPagination.list.length == 0) {

        return;
    }

    beanPagination.list.forEach((detalle) => {


        row += `
            <div class="single-post row">
            <div class="col-lg-3  col-md-3 meta-details">
                <btn class="primary genric-btn ">$12</btn>

                <div class="user-details row">
                    <p class="view col-lg-12 col-md-12 col-6"><a href="#">Disponible</a> <span
                            class="lnr lnr-eye"></span></p>
                    <p class="date col-lg-12 col-md-12 col-6">Días de preparación <span
                            class="lnr lnr-calendar-full"></span>
                    <ul class="tags">
                        <li>Lunes,</li>
                        <li>Martes,</li>
                        <li>Miercoles,</li>
                        <li>Jueves</li>
                    </ul>
                    </p>


                </div>
            </div>
            <div class="col-lg-9 col-md-9 ">
                <div class="feature-img">
                    <img class="img-fluid" src="<?php echo SERVERURL; ?>vistas/img/blog/feature-img2.jpg"
                        alt="">
                </div>
                <a class="posts-title" href="blog-single.html">
                    <h3>The Basics Of Buying A Telescope</h3>
                </a>

            </div>
        </div>
            `;




    });



    document.querySelector('#tbodyDetalle').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(6),
        document.querySelector("#pageComida"),
        $('#modalCargandoDetalle'),
        $('#paginationDetalle'));

}
function countCategoria(beanPagination) {
    let row = "";
    document.querySelector('#tbodyCountCategoria').innerHTML = "";
    if (beanPagination.list.length == 0) {

        return;
    }
    row += `
    <h4 class="category-title">Categorias</h4>
    <ul class="cat-list">
    `;
    beanPagination.list.forEach((lista) => {
        row += `
            <li>
                <a href="#" class="d-flex justify-content-between">
                    <p>${tipoComida(parseInt(lista.split(":")[0]))}</p>
                    <p>${lista.split(":")[1]}</p>
                </a>
            </li>
        
            `;

    });

    row += `
    </ul>
    `;

    document.querySelector('#tbodyCountCategoria').innerHTML += row;


}
function tipoComida(params) {
    switch (params) {
        case 1:

            return "ENTRADA";
        case 2:

            return "PLATO DE FONDO";
        case 3:

            return "POSTRE";
        case 4:

            return "BEBIDA";

        default:
            return "";
    }

}
function listaRestaurante(bean) {
    let row = "";
    document.querySelector('#tbodyRestaurante').innerHTML = "";
    if (bean == null) {

        return;
    }

    row += `
        <img src="${getHostFrontEnd()}vistas/img/blog/user-info.png" alt="">
        <a href="#">
            <h4>${bean.nombre}</h4>
        </a>

        <ul class="social-links">
            <li><a href="${bean.facebook}"><i class="fa fa-facebook"></i></a></li>
           
        </ul>
        <div class="single-post mb-0">
            <div class="meta-details mt-0">

                <div class="user-details row">
                    <p class="view col-lg-12 col-md-12 col-6">${bean.ciudad.departamento.nombre} - ${bean.ciudad.nombre}<span
                        class="lnr lnr-eye pl-2"></span></p>
                    <p class="date col-lg-12 col-md-12 col-6">${bean.direccion}<span
                            class="lnr lnr-calendar-full pl-2"></span></p>
                    <p class="comments col-lg-12 col-md-12 col-6">${bean.email}<span
                            class="lnr lnr-bubble pl-2"></span></p>
                </div>
            </div>

        </div>
            `;

    document.querySelector('#tbodyRestaurante').innerHTML += row;
    beanRequestDetalle.entity_api = 'comidas';
    beanRequestDetalle.operation = 'categoria/count-all';
    beanRequestDetalle.type_request = 'GET';
    processAjax();

}