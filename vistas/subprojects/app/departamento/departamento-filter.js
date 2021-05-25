var beanPaginationDepartamento;
var departamentoSelected;
var beanRequestDepartamento = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestDepartamento.entity_api = 'departamentos';
    beanRequestDepartamento.operation = 'paginate';
    beanRequestDepartamento.type_request = 'GET';

    document.querySelector("#ciudadHTML").classList.add("d-none");
    $('#sizePageDepartamento').change(function () {
        beanRequestDepartamento.type_request = 'GET';
        beanRequestDepartamento.operation = 'paginate';
        $('#modalCargandoDepartamento').modal('show');
    });

    $('#modalCargandoDepartamento').modal('show');

    $("#modalCargandoDepartamento").on('shown.bs.modal', function () {
        processAjaxDepartamento();
    });

    $("#ventanaModalManDepartamento").on('hide.bs.modal', function () {
        beanRequestDepartamento.type_request = 'GET';
        beanRequestDepartamento.operation = 'paginate';
    });




});

function processAjaxDepartamento() {

    let parameters_pagination = '';

    switch (beanRequestDepartamento.operation) {


        default:

            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + document.querySelector("#pageDepartamento").value.trim();
            parameters_pagination +=
                '&size=' + document.querySelector("#sizePageDepartamento").value.trim();
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestDepartamento.entity_api + "/" + beanRequestDepartamento.operation +
            parameters_pagination,
        type: beanRequestDepartamento.type_request,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: "",
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



function listaDepartamento(beanPagination) {
    document.querySelector('#tbodyDepartamento').innerHTML = '';
    document.querySelector('#titleManagerDepartamento').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] DEPARTAMENTOS';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationDepartamento'));
        row += `<tr>
        <td class="text-center" colspan="6">NO HAY DEPARTAMENTOS</td>
        </tr>`;

        document.querySelector('#tbodyDepartamento').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyDepartamento').innerHTML += row;

    beanPagination.list.forEach((departamento) => {

        row += `<tr  idDepartamento="${departamento.idDepartamento}">
<td class="text-center">${departamento.nombre}</td>
<td class="text-center">
<button class="btn btn-info ver-ciudad" ><i class="fa fa-list"></i> </button>
</td>
`;

        // $('[data-toggle="tooltip"]').tooltip();
    });
    document.querySelector('#tbodyDepartamento').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(document.querySelector("#sizePageDepartamento").value),
        document.querySelector("#pageDepartamento"),
        $('#modalCargandoDepartamento'),
        $('#paginationDepartamento'));
    addEventsButtonsDepartamento();


}

function addEventsButtonsDepartamento() {

    document.querySelectorAll('.ver-ciudad').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            departamentoSelected = findByDepartamento(
                btn.parentElement.parentElement.getAttribute('idDepartamento')
            );

            if (departamentoSelected != undefined) {
                $('#modalCargandoCiudad').modal('show');
                document.querySelector("#ciudadHTML").classList.remove("d-none");
                document.querySelector("#departamentoHTML").classList.add("d-none");
            } else {
                console.log(
                    'warning',
                    'No se encontró el registro de ciudad'
                );
            }
        };
    });

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
