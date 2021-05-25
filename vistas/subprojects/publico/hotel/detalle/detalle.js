var beanPaginationDetalle, beanPaginationHotel;
var detalleSelected, hotelSelected, contadorDetalle = 2, valorHover;
var beanRequestDetalle = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestDetalle.entity_api = 'hotel/detalle';
    beanRequestDetalle.operation = 'paginate/hot';
    beanRequestDetalle.type_request = 'GET';
    let GETsearch = window.location.pathname;

    if (GETsearch.split("/").length == 5) {
        if (/^[0-9.]*$/.test(GETsearch.split("/")[4])) {
            hotelSelected = { "idHotel": GETsearch.split("/")[4] };
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


    parameters_pagination +=
        '?id=' + hotelSelected.idHotel;
    parameters_pagination +=
        '&page=1';
    parameters_pagination +=
        '&size=1';



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


            beanPaginationHotel = beanCrudResponse.beanPagination;
            listaDetalle(beanPaginationHotel);



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

    let row = "", row2 = "", row3 = "";
    document.querySelector('#tbodyHotel').innerHTML = "";
    if (beanPagination.list.length == 0) {

        return;
    }
    beanPaginationDetalle = listByDetalleHotel();
    beanPaginationHotel.list = listByHotel();
    beanPaginationHotel.list.forEach((hotel) => {

        row += `
        <div class="col-lg-6 info-left">
        <img class="img-fluid" src="${getHostFrontEnd() + "resources/img/HOTELES/" + hotel.imagen}" alt="">
    </div>
    <div class="col-lg-6 info-right">
        <h6>Acerca de Nosotros</h6>
        <h1>Quiènes Somos?</h1>
        <p>${hotel.descripcion}</p>
    </div>
            `;

        row2 += `
       

        <div class="single-sidebar-widget user-info-widget" >
       
        <a href="#">
            <h4>${hotel.nombre}</h4>
        </a>
        <p class="view col-lg-12 col-md-12 col-6">${hotel.ciudad.departamento.nombre} - ${hotel.ciudad.nombre}</p>
        <ul class="social-links">
            <li><a href="${hotel.facebook}" target="_blank"><i class="fa fa-facebook"></i></a></li>
            <li><a href="javascript:void(0);" ><i class="fa fa-phone"></i></a></li>
            <li><a href="${hotel.web}" target="_blank"><i class="fa fa-webchat"></i></a></li>
            <li><a href="https://web.whatsapp.com/send?phone=51${hotel.telefono}" target="_blank"><i class="fa fa-whatsapp"></i></a></li>
         
		</a>
           
        </ul>
        <h4 class="newsletter-title" >S/. ${hotel.precio}</h4>
        <div class="single-post mb-0">
            <div class="meta-details mt-0">
            <h6 class="py-3 text-center">SERVICIOS DISPONIBLES</h6>
                <div class="user-details row">
                `;

        beanPaginationDetalle.forEach((detalle) => {
            row2 += `<p class="col-lg-12 col-md-12 col-6 my-3">${detalle.categoria.nombre} : ${detalle.estado == 1 ? "SI" : "NO"}</p>
        `;

        });



        row2 += `           
                </div>
            </div>

        </div>

        </div>
                `;
        row3 += `
        <div class="single-contact-address d-flex flex-row">
        <div class="icon">
            <span class="lnr lnr-home"></span>
        </div>
        <div class="contact-details">
            <h5>${hotel.ciudad.nombre + ", " + hotel.ciudad.departamento.nombre}, Perú</h5>
            <p>
            ${hotel.direccion}
            </p>
        </div>
    </div>
    <div class="single-contact-address d-flex flex-row">
        <div class="icon">
            <span class="lnr lnr-phone-handset"></span>
        </div>
        <div class="contact-details">
            <h5>(51) ${hotel.telefono}</h5>
            <p class="d-none">Lunes a Viernes de 8 am a 7 pm </p>
            <p class="d-none">Sábados y Domingos de 9 am a 3 pm </p>
        </div>
    </div>
    <div class="single-contact-address d-flex flex-row">
        <div class="icon">
            <span class="lnr lnr-envelope"></span>
        </div>
        <div class="contact-details">
            <h5>${hotel.email}</h5>
            <p>Escríbenos en cualquier momento!</p>
        </div>
    </div>
                    `;

        document.querySelector('.name_hotel').innerHTML = hotel.nombre;
        document.querySelector('.txtTranslados').innerHTML = hotel.traslado == null ? "No Incluye" : hotel.traslado;
        document.querySelector('.txtAlojamientos').innerHTML = hotel.alojamiento == null ? "No Incluye" : hotel.alojamiento;
        document.querySelector('.txtAlimentacion').innerHTML = hotel.alimentacion == null ? "No Incluye" : hotel.alimentacion;
        document.querySelector('.txtTours').innerHTML = hotel.tours == null ? "No Incluye" : hotel.tours;
    });

    document.querySelector('#detalleHotel').innerHTML = row2;
    document.querySelector('#infoHotel').innerHTML = row3;
    document.querySelector('#tbodyHotel').innerHTML = row;

}


function listByHotel() {
    return beanPaginationHotel.list.filter(
        (Hotel) => {
            if (Hotel.idHotel > 0) {
                return Hotel;
            }


        }
    );
}

function listByDetalleHotel() {
    return beanPaginationHotel.list.filter(
        (Detalle) => {
            if (Detalle.idDetalleHotel > 0) {
                return Detalle;
            }


        }
    );
}