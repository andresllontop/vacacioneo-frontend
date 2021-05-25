var beanPaginationDepartamento;
var departamentoSelected;
var beanRequestDepartamento = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestDepartamento.entity_api = 'departamentos';
    beanRequestDepartamento.operation = 'paginate';
    beanRequestDepartamento.type_request = 'GET';



    $('#modalCargandoDepartamento').modal('show');

    $("#modalCargandoDepartamento").on('shown.bs.modal', function () {
        processAjaxDepartamento();
    });

    $("#ventanaModalManDepartamento").on('hide.bs.modal', function () {
        beanRequestDepartamento.type_request = 'GET';
        beanRequestDepartamento.operation = 'paginate';
    });



    $("#btnAbrirbook").click(function () {
        beanRequestDepartamento.operation = 'add';
        beanRequestDepartamento.type_request = 'POST';
        $("#imagePreview").html("");
        $("#tituloModalManDepartamento").html("REGISTRAR DEPARTAMENTO");
        addDepartamento();
        $("#ventanaModalManDepartamento").modal("show");


    });
    $("#formularioDepartamento").submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormDepartamento()) {
            $('#modalCargandoDepartamento').modal('show');
        }
    });

});

function processAjaxDepartamento() {

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestDepartamento.operation == 'update' ||
        beanRequestDepartamento.operation == 'add'
    ) {

        json = {
            idDepartamento: null,
            nombre: document.querySelector("#txtNombreDepartamento").value,

        };


    }

    switch (beanRequestDepartamento.operation) {
        case 'delete':
            parameters_pagination = '/' + departamentoSelected.idDepartamento;
            break;

        case 'update':
            json.idDepartamento = departamentoSelected.idDepartamento;
            break;
        case 'add':
            break;

        default:

            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + document.querySelector("#pageDepartamento").value.trim();
            parameters_pagination +=
                '&size=6';
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestDepartamento.entity_api + "/" + beanRequestDepartamento.operation +
            parameters_pagination,
        type: beanRequestDepartamento.type_request,
        headers: {
        },

        data: JSON.stringify(json),
        cache: false,
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoDepartamento').modal('hide');
        if (beanCrudResponse.messageServer !== null) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                swal({
                    title: "Realizado",
                    text: "Acción realizada existosamente!",
                    type: "success",
                    timer: 800,
                    showConfirmButton: false
                });
                document.querySelector("#pageDepartamento").value = 1;
                document.querySelector("#sizePageDepartamento").value = 20;
                $('#ventanaModalManDepartamento').modal('hide');
            } else {


                swal({
                    title: "Error",
                    text: beanCrudResponse.messageServer,
                    type: "warning",
                    timer: 1200,
                    showConfirmButton: false
                });
            }
        }
        if (beanCrudResponse.beanPagination !== null) {

            beanPaginationDepartamento = beanCrudResponse.beanPagination;
            listaDepartamento(beanPaginationDepartamento);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoDepartamento').modal("hide");
        console.log(errorThrown);

    });

}

function addDepartamento(departamento = undefined) {
    //LIMPIAR LOS CAMPOS

    document.querySelector('#txtNombreDepartamento').value = (departamento == undefined) ? '' : departamento.nombre;

}

function listaDepartamento(beanPagination) {
    document.querySelector('#tbodyDepartamento').innerHTML = '';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationDepartamento'));
        row += ``;

        document.querySelector('#tbodyDepartamento').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyDepartamento').innerHTML += row;

    beanPagination.list.forEach((departamento) => {

        row += `<div class="col-lg-4">
        <div class="single-destination relative">
            <div class="thumb relative">
                <div class="overlay overlay-bg"></div>
                <img class="img-fluid" src="${getHostFrontEnd() + "resources/img/DEPARTAMENTOS/" + departamento.imagen}" alt="">
            </div>
            <div class="desc">
            <a href="${getHostFrontEnd() + "destino/detalle/" + departamento.idDepartamento}" class="price-btn">Ver Ciudades</a>
                <h4>${departamento.nombre}</h4>
                
            </div>
        </div>
    </div>`;


    });
    document.querySelector('#tbodyDepartamento').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(6),
        document.querySelector("#pageDepartamento"),
        $('#modalCargandoDepartamento'),
        $('#paginationDepartamento'));



}





function findIndexDepartamento(idbusqueda) {
    return beanPaginationDepartamento.list.findIndex(
        (Departamento) => {
            if (Departamento.idDepartamento == parseInt(idbusqueda))
                return Departamento;


        }
    );
}

function findByDepartamento(idDepartamento) {
    return beanPaginationDepartamento.list.find(
        (Departamento) => {
            if (parseInt(idDepartamento) == Departamento.idDepartamento) {
                return Departamento;
            }


        }
    );
}
