var beanPaginationCategoria;
var categoriaSelected;
var beanRequestCategoria = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    beanRequestCategoria.entity_api = 'categorias';
    beanRequestCategoria.operation = 'paginate';
    beanRequestCategoria.type_request = 'GET';

    $('#sizePageCategoria').change(function () {
        beanRequestCategoria.type_request = 'GET';
        beanRequestCategoria.operation = 'paginate';
        $('#modalCargandoCategoria').modal('show');
    });

    $('#modalCargandoCategoria').modal('show');

    $("#modalCargandoCategoria").on('shown.bs.modal', function () {
        processAjaxCategoria();
    });

    $("#ventanaModalManCategoria").on('hide.bs.modal', function () {
        beanRequestCategoria.type_request = 'GET';
        beanRequestCategoria.operation = 'paginate';
    });



    $("#btnAbrirbook").click(function () {
        beanRequestCategoria.operation = 'add';
        beanRequestCategoria.type_request = 'POST';
        $("#imagePreview").html("");
        $("#tituloModalManCategoria").html("REGISTRAR SERVICIO");
        addCategoria();
        $("#ventanaModalManCategoria").modal("show");


    });
    $("#formularioCategoria").submit(function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateFormCategoria()) {
            $('#modalCargandoCategoria').modal('show');
        }
    });

});

function processAjaxCategoria() {


    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestCategoria.operation == 'update' ||
        beanRequestCategoria.operation == 'add'
    ) {

        json = {
            idCategoria: null,
            nombre: document.querySelector("#txtNombreCategoria").value,

        };


    }

    switch (beanRequestCategoria.operation) {
        case 'delete':
            parameters_pagination = '/' + categoriaSelected.idCategoria;
            break;

        case 'update':
            json.idCategoria = categoriaSelected.idCategoria;
            break;
        case 'add':

            break;

        default:

            parameters_pagination +=
                '?filter=';
            parameters_pagination +=
                '&page=' + document.querySelector("#pageCategoria").value.trim();
            parameters_pagination +=
                '&size=' + document.querySelector("#sizePageCategoria").value.trim();
            break;
    }
    $.ajax({
        url: getHostAPI() + beanRequestCategoria.entity_api + "/" + beanRequestCategoria.operation +
            parameters_pagination,
        type: beanRequestCategoria.type_request,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get("vacacioneo_token")
        },

        data: JSON.stringify(json),
        cache: false,
        contentType: 'application/json; charset=UTF-8',
        processData: false,
        dataType: 'json',
    }).done(function (beanCrudResponse) {

        $('#modalCargandoCategoria').modal('hide');
        if (beanRequestCategoria.operation == "delete") {
            beanRequestCategoria.type_request = 'GET';
            beanRequestCategoria.operation = 'paginate';
        }
        if (beanCrudResponse.messageServer !== null) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                swal({
                    title: "Realizado",
                    text: "Acción realizada existosamente!",
                    type: "success",
                    timer: 800,
                    showConfirmButton: false
                });
                document.querySelector("#pageCategoria").value = 1;
                document.querySelector("#sizePageCategoria").value = 20;
                $('#ventanaModalManCategoria').modal('hide');
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

            beanPaginationCategoria = beanCrudResponse.beanPagination;
            listaCategoria(beanPaginationCategoria);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#modalCargandoCategoria').modal("hide");
        console.log(errorThrown);

    });

}

function addCategoria(categoria = undefined) {
    //LIMPIAR LOS CAMPOS

    document.querySelector('#txtNombreCategoria').value = (categoria == undefined) ? '' : categoria.nombre;



}

function listaCategoria(beanPagination) {
    document.querySelector('#tbodyCategoria').innerHTML = '';
    document.querySelector('#titleManagerCategoria').innerHTML =
        '[ ' + beanPagination.countFilter + ' ] SERVICIOS';
    let row = "";

    if (beanPagination.list.length == 0) {
        destroyPagination($('#paginationCategoria'));
        row += `<tr>
        <td class="text-center" colspan="6">NO HAY CATEGORIAS</td>
        </tr>`;

        document.querySelector('#tbodyCategoria').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyCategoria').innerHTML += row;
    beanPagination.list.forEach((categoria) => {

        row += `<tr  idCategoria="${categoria.idCategoria}">
<td class="text-center">${categoria.nombre}</td>
<td class="text-center">
<button class="btn btn-info editar-categoria" ><i class="fa fa-edit"></i> </button>
</td>
<td class="text-center">
<button class="btn btn-danger eliminar-categoria"><i class="fa fa-trash"></i></button>
</td>
</tr>`;

        // $('[data-toggle="tooltip"]').tooltip();
    });
    document.querySelector('#tbodyCategoria').innerHTML += row;
    buildPagination(
        beanPagination.countFilter,
        parseInt(document.querySelector("#sizePageCategoria").value),
        document.querySelector("#pageCategoria"),
        $('#modalCargandoCategoria'),
        $('#paginationCategoria'));
    addEventsButtonsCategoria();


}

function addEventsButtonsCategoria() {


    document.querySelectorAll('.editar-categoria').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            categoriaSelected = findByCategoria(
                btn.parentElement.parentElement.getAttribute('idCategoria')
            );

            if (categoriaSelected != undefined) {
                addCategoria(categoriaSelected);
                $("#tituloModalManCategoria").html("EDITAR SERVICIO");
                $("#ventanaModalManCategoria").modal("show");
                beanRequestCategoria.type_request = 'PUT';
                beanRequestCategoria.operation = 'update';
            } else {
                console.log(
                    'warning',
                    'No se encontró el Almacen para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-categoria').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            //   $('[data-toggle="tooltip"]').tooltip("hide");
            categoriaSelected = findByCategoria(
                btn.parentElement.parentElement.getAttribute('idCategoria')
            );

            if (categoriaSelected != undefined) {
                beanRequestCategoria.type_request = 'DELETE';
                beanRequestCategoria.operation = 'delete';
                $('#modalCargandoCategoria').modal('show');
            } else {
                console.log(
                    'warning',
                    'No se encontró el registro para poder editar'
                );
            }
        };
    });
}


function findIndexCategoria(idbusqueda) {
    return beanPaginationCategoria.list.findIndex(
        (Categoria) => {
            if (Categoria.idCategoria == parseInt(idbusqueda))
                return Categoria;


        }
    );
}

function findByCategoria(idCategoria) {
    return beanPaginationCategoria.list.find(
        (Categoria) => {
            if (parseInt(idCategoria) == Categoria.idCategoria) {
                return Categoria;
            }


        }
    );
}

var validateFormCategoria = () => {
    if (document.querySelector("#txtNombreCategoria").value == "") {
        swal({
            title: "Vacío",
            text: "Ingrese Nombre",
            type: "warning",
            timer: 1200,
            showConfirmButton: false
        });
        return false;
    }


    return true;
}