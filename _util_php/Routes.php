<?php
class Routes
{

    public function getResourceForContainerApp()
    {
        $routes = new Routes();
        //$routes = $routes->isURLValidate();
        $path_resource_server = SERVERURL . "vistas/subprojects/app/";
        $path_resource = "vistas/subprojects/app/";
        $path_scripts = "";
        $path_style = "";
        //VALIDAMOS SI ES UNA URL CORRECTA
        if ($routes->isURLValidate()) {
            $version_proyect = "1.10";
            /*
            $version_proyect = 1.0; -> antes del 02/09/2020
             */
            /*CAMBIAR EL CONTEXTO DE ACUERDO AL PROYECTO. DEJAR EN <</>> CUANDO ESTA EN PRODUCCIÓN */
            //$context = '/';
            $context = 'vacacioneo-frontend./';
            //EXTRAEMOS EL CONTEXTO + EL PATH
            $context_path = $_SERVER['REQUEST_URI'];

            //EXTRAEMOS SOLO EL PATH DEL (CONTEXTO + PATH)
            $path = substr($context_path, strlen($context));
            //HACEMOS UN SPLIT PARA DEJAR EL PATH SIN PARAMETROS
            $values_path = explode("?", $path);
            //TOMAMOS LA PRIMERA PARTICIÓN
            $path = $values_path[0];
            //VERIFICAMOS SI EL ULTIMO CARACTER ES /
            if (substr($path, strlen($path) - 1, strlen($path)) == "/") {
                //EXTRAEMOS EL PATH SIN EL CARACTER PARA QUE VALIDE BIEN NUESTRA ITERACIÓN DE ABAJO
                $path = substr($path, 0, strlen($path) - 1);
            }
            /*
            AQUÍ ES DONDE VAMOS A CONFIGURAR NUESTRAS PAGINAS
            //EXAMPLE -> new BeanResource(path,path_resource);
            //array_push($list_pages, $resource);
             */
            $list_pages = array();
            /* ----MODULO DE APP---- */

            //HOME
            $resource = new BeanResource('app/index', array($path_resource . 'index/index.html'), array(), array());
            array_push($list_pages, $resource);
            //RESTAURANTE
            $resource = new BeanResource('app/restaurant', array($path_resource . 'restaurante/restaurante.html'), array($path_resource_server . 'restaurante/restaurante.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);
            //DEPARTAMENTO
            $resource = new BeanResource('app/departamento', array($path_resource . 'departamento/departamento.html'), array($path_resource_server . 'departamento/departamento.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);
            //ciudad
            $resource = new BeanResource('app/ciudad', array($path_resource . 'departamento/ciudad/ciudad.html', $path_resource . 'departamento/departamento-filter.html'), array($path_resource_server . 'departamento/ciudad/ciudad.js?v=' . $version_proyect, $path_resource_server . 'departamento/departamento-filter.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);
            //hotel
            $resource = new BeanResource('app/hotel', array($path_resource . 'hotel/hotel.html'), array($path_resource_server . 'hotel/hotel.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);
            //hotel/detalle
            $resource = new BeanResource('app/hotel/detalle', array($path_resource . 'hotel/servicio/servicio.html', $path_resource . 'hotel/hotel-filter.html'), array($path_resource_server . 'hotel/servicio/servicio.js?v=' . $version_proyect, $path_resource_server . 'hotel/hotel-filter.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);
            //categoria
            $resource = new BeanResource('app/servicio', array($path_resource . 'categoria/categoria.html'), array($path_resource_server . 'categoria/categoria.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);

            $exists = false;

            foreach ($list_pages as $_resource) {
                if (substr($_resource->path, -1) == ":") {
                    // echo (substr($_resource->path, -1));
                    //echo (substr($_resource->path, 0, -2));
                    //    var_dump($routes->contiene_palabra($path, substr($_resource->path, 0, -2)));
                    if ($routes->contiene_palabra($path, substr($_resource->path, 0, -2)) == 1) {
                        $exists = true;
                        $path_resource = $_resource->path_resource;
                        $path_scripts = $_resource->path_scripts;
                        $path_style = $_resource->path_styles;
                        break;
                    }
                } else {
                    if ($path == $_resource->path) {
                        $exists = true;
                        $path_resource = $_resource->path_resource;
                        $path_scripts = $_resource->path_scripts;
                        $path_style = $_resource->path_styles;
                        break;
                    }
                }

            }

            /* foreach ($list_pages as $_resource) {

            if ($path == $_resource->path) {
            $exists = true;
            $path_resource = $_resource->path_resource;
            $path_scripts = $_resource->path_scripts;
            $path_style = $_resource->path_styles;
            break;
            }

            }
             */
            if (!$exists) {
                $path_resource = [$path_resource . 'app/index/index.html'];
            }

        } else {
            /*URL NO VALIDO */
            $path_resource = [$path_resource . 'app/index/index.html'];
        }
        $resources = new BeanResource($path, $path_resource, $path_scripts, $path_style);
        return $resources;
    }
    public function getResourceForContainerAuth()
    {
        $routes = new Routes();
        //$routes = $routes->isURLValidate();
        $path_resource_server = SERVERURL . "vistas/subprojects/";
        $path_resource = "vistas/subprojects/";
        $path_scripts = "";
        $path_style = "";
        //VALIDAMOS SI ES UNA URL CORRECTA
        if ($routes->isURLValidate()) {
            $version_proyect = "0.06";
            /*
            $version_proyect = 1.0; -> antes del 02/09/2020
             */
            /*CAMBIAR EL CONTEXTO DE ACUERDO AL PROYECTO. DEJAR EN <</>> CUANDO ESTA EN PRODUCCIÓN */
            //$context = '/';
            $context = 'vacacioneo-frontend./';
            //EXTRAEMOS EL CONTEXTO + EL PATH
            $context_path = $_SERVER['REQUEST_URI'];

            //EXTRAEMOS SOLO EL PATH DEL (CONTEXTO + PATH)
            $path = substr($context_path, strlen($context));
            //HACEMOS UN SPLIT PARA DEJAR EL PATH SIN PARAMETROS
            $values_path = explode("?", $path);
            //TOMAMOS LA PRIMERA PARTICIÓN
            $path = $values_path[0];
            //VERIFICAMOS SI EL ULTIMO CARACTER ES /
            if (substr($path, strlen($path) - 1, strlen($path)) == "/") {
                //EXTRAEMOS EL PATH SIN EL CARACTER PARA QUE VALIDE BIEN NUESTRA ITERACIÓN DE ABAJO
                $path = substr($path, 0, strlen($path) - 1);
            }
            /*
            AQUÍ ES DONDE VAMOS A CONFIGURAR NUESTRAS PAGINAS
            //EXAMPLE -> new BeanResource(path,path_resource);
            //array_push($list_pages, $resource);
             */
            $list_pages = array();
            /* ----MODULO DE APP---- */

            //LOGIN
            $resource = new BeanResource('auth/login', array($path_resource . 'auth/login/login.html'), array($path_resource_server . 'auth/login/login.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);

            $exists = false;

            foreach ($list_pages as $_resource) {

                if ($path == $_resource->path) {
                    $exists = true;
                    $path_resource = $_resource->path_resource;
                    $path_scripts = $_resource->path_scripts;
                    $path_style = $_resource->path_styles;
                    break;
                }

            }

            /* foreach ($list_pages as $_resource) {

            if ($path == $_resource->path) {
            $exists = true;
            $path_resource = $_resource->path_resource;
            $path_scripts = $_resource->path_scripts;
            $path_style = $_resource->path_styles;
            break;
            }

            }
             */
            if (!$exists) {
                $path_resource = [$path_resource . 'modulo/404.html'];
            }

        } else {
            /*URL NO VALIDO */
            $path_resource = [$path_resource . 'modulo/404.html'];
        }
        $resources = new BeanResource($path, $path_resource, $path_scripts, $path_style);
        return $resources;
    }
    public function getResourceForContainerPublico()
    {
        $routes = new Routes();
        //$routes = $routes->isURLValidate();
        $path_resource_server = SERVERURL . "vistas/subprojects/";
        $path_resource = "vistas/subprojects/";
        $path_scripts = "";
        $path_style = "";
        //VALIDAMOS SI ES UNA URL CORRECTA
        if ($routes->isURLValidate()) {
            $version_proyect = "0.06";
            /*
            $version_proyect = 1.0; -> antes del 02/09/2020
             */
            /*CAMBIAR EL CONTEXTO DE ACUERDO AL PROYECTO. DEJAR EN <</>> CUANDO ESTA EN PRODUCCIÓN */
            //$context = '/';
            $context = 'vacacioneo-frontend./';
            //EXTRAEMOS EL CONTEXTO + EL PATH
            $context_path = $_SERVER['REQUEST_URI'];

            //EXTRAEMOS SOLO EL PATH DEL (CONTEXTO + PATH)
            $path = substr($context_path, strlen($context));
            //HACEMOS UN SPLIT PARA DEJAR EL PATH SIN PARAMETROS
            $values_path = explode("?", $path);
            //TOMAMOS LA PRIMERA PARTICIÓN
            $path = $values_path[0];
            //VERIFICAMOS SI EL ULTIMO CARACTER ES /
            if (substr($path, strlen($path) - 1, strlen($path)) == "/") {
                //EXTRAEMOS EL PATH SIN EL CARACTER PARA QUE VALIDE BIEN NUESTRA ITERACIÓN DE ABAJO
                $path = substr($path, 0, strlen($path) - 1);
            }
            /*
            AQUÍ ES DONDE VAMOS A CONFIGURAR NUESTRAS PAGINAS
            //EXAMPLE -> new BeanResource(path,path_resource);
            //array_push($list_pages, $resource);
             */
            $list_pages = array();

            /* ----MODULO DE PUBLICO---- */

            //HOME
            $resource = new BeanResource('home', array($path_resource . 'publico/index/index.html'), array($path_resource_server . 'publico/index/ciudad.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);
            //HOME
            $resource = new BeanResource('', array($path_resource . 'publico/index/index.html'), array($path_resource_server . 'publico/index/ciudad.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);
            //DESTINO
            $resource = new BeanResource('destino', array($path_resource . 'publico/destino/destino.html'), array($path_resource . 'publico/destino/destino.js?v=' . $version_proyect), array(SERVERURL . "vistas/css/vacacioneo.css?v=" . $version_proyect));
            array_push($list_pages, $resource);
            //DESTINO
            $resource = new BeanResource('destino/detalle/:', array($path_resource . 'publico/destino/detalle/detalle.html'), array($path_resource_server . 'publico/destino/detalle/detalle.js?v=' . $version_proyect), array(SERVERURL . "vistas/css/vacacioneo.css?v=" . $version_proyect));
            array_push($list_pages, $resource);
            //HOTEL
            $resource = new BeanResource('hotel', array($path_resource . 'publico/hotel/hotel.html'), array($path_resource . 'publico/hotel/hotel.js?v=' . $version_proyect, $path_resource . 'publico/departamento/departamento.js?v=' . $version_proyect), array(SERVERURL . "vistas/css/vacacioneo.css?v=" . $version_proyect));
            array_push($list_pages, $resource);
            /////////restaurant-detalle
            $resource = new BeanResource('hotel/detalle/:', array($path_resource . 'publico/hotel/detalle/detalle.html'), array($path_resource_server . 'publico/hotel/detalle/detalle.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);

            //contact
            $resource = new BeanResource('contact', array($path_resource . 'publico/contact/contact.html'), array(), array());
            array_push($list_pages, $resource);
            //element
            $resource = new BeanResource('element', array($path_resource . 'publico/element/element.html'), array(), array());
            array_push($list_pages, $resource);
            //restaurant
            $resource = new BeanResource('restaurant', array($path_resource . 'publico/restaurant/restaurant.html'), array($path_resource_server . 'publico/restaurant/restaurant.js?v=' . $version_proyect), array(SERVERURL . "vistas/css/vacacioneo.css?v=" . $version_proyect));
            array_push($list_pages, $resource);
            /////////restaurant-detalle
            $resource = new BeanResource('restaurant/detalle/:', array($path_resource . 'publico/restaurant/detalle/detalle.html'), array($path_resource_server . 'publico/restaurant/detalle/detalle.js?v=' . $version_proyect), array());
            array_push($list_pages, $resource);
            //paquete
            $resource = new BeanResource('paquete', array($path_resource . 'publico/paquete/paquete.html'), array(), array());
            array_push($list_pages, $resource);

            $exists = false;

            foreach ($list_pages as $_resource) {
                if (substr($_resource->path, -1) == ":") {
                    // echo (substr($_resource->path, -1));
                    //echo (substr($_resource->path, 0, -2));
                    //    var_dump($routes->contiene_palabra($path, substr($_resource->path, 0, -2)));
                    if ($routes->contiene_palabra($path, substr($_resource->path, 0, -2)) == 1) {
                        $exists = true;
                        $path_resource = $_resource->path_resource;
                        $path_scripts = $_resource->path_scripts;
                        $path_style = $_resource->path_styles;
                        break;
                    }
                } else {
                    if ($path == $_resource->path) {
                        $exists = true;
                        $path_resource = $_resource->path_resource;
                        $path_scripts = $_resource->path_scripts;
                        $path_style = $_resource->path_styles;
                        break;
                    }
                }

            }

            /* foreach ($list_pages as $_resource) {

            if ($path == $_resource->path) {
            $exists = true;
            $path_resource = $_resource->path_resource;
            $path_scripts = $_resource->path_scripts;
            $path_style = $_resource->path_styles;
            break;
            }

            }
             */
            if (!$exists) {
                $path_resource = [$path_resource . 'publico/index/index.html'];
            }

        } else {
            /*URL NO VALIDO */
            $path_resource = [$path_resource . 'publico/index/index.html'];
        }
        $resources = new BeanResource($path, $path_resource, $path_scripts, $path_style);
        return $resources;
    }

    public function isURLValidate()
    {
        $url_actual = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        if (filter_var($url_actual, FILTER_VALIDATE_URL)) {
            return true;
        } else {
            return false;
        }
    }
    public function subProject()
    {
        $routes = new Routes();
        if (strpos($routes->getResourceForContainerApp()->path, 'app') !== false) {
            include 'app.php';
        } else if (strpos($routes->getResourceForContainerAuth()->path, 'auth') !== false) {
            include 'auth.php';
        } else {
            include 'publico.php';
        }

    }

    public function contiene_palabra($texto, $palabra)
    {
        return preg_match('*\b' . $palabra . '\b*i', $texto);
    }

}
