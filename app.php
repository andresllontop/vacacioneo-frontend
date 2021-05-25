<!DOCTYPE html>
<html lang="es" class="no-js">

<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>VACACIONEO</title>
	<meta name="description" content="Blueprint: A basic template for a responsive multi-level menu" />
	<meta name="keywords" content="blueprint, template, html, css, menu, responsive, mobile-friendly" />
	<meta name="author" content="Codrops" />
	<link rel="shortcut icon" href="<?php echo SERVERURL; ?>vistas/img/vacacioneo.png">
	<!-- food icons -->
	<link rel="stylesheet" type="text/css" href="<?php echo SERVERURL; ?>vistas/subprojects/app/asset/css/organicfoodicons.css" />
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/font-awesome.min.css">
	<!-- demo styles -->
	<link rel="stylesheet" type="text/css" href="<?php echo SERVERURL; ?>vistas/subprojects/app/asset/css/demo.css" />
	<!-- menu styles -->
	<link rel="stylesheet" type="text/css" href="<?php echo SERVERURL; ?>vistas/subprojects/app/asset/css/component.css" />
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/sweet-alert.css?v=0.56">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/bootstrap.css">
	<?php

$beanResource = $routes->getResourceForContainerApp();
//INCLUIMOS LOS STYLES
$array_styles = $beanResource->path_styles;
if ($array_styles != "") {
    foreach ($array_styles as $path_style) {
        echo '
                <link
                rel="stylesheet"
                href="' . $path_style . '"
              />

            ';
    }}
?>

</head>

<body>
	<!-- Main container -->
	<div class="container-fluid">
		<!-- Blueprint header -->
		<?php include "./vistas/subprojects/app/modulo/header.html";include "./vistas/subprojects/app/modulo/nav-lateral.html";?>
		<div class="content">
		<?php
//INCLUIMOS LOS HTML
$array_resource = $beanResource->path_resource;
if ($array_resource != "") {
    foreach ($array_resource as $path_resources) {
        include $path_resources;
    }}

?>

		</div>
	</div>
	<!-- /view -->
	<script src="<?php echo SERVERURL; ?>vistas/js/vendor/jquery-2.2.4.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/popper.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/vendor/bootstrap.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/subprojects/app/asset/js/modernizr-custom.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/subprojects/app/asset/js/classie.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/subprojects/app/asset/js/dummydata.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/subprojects/app/asset/js/main.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/sweet-alert.min.js?v=0.56"></script>


	<script type="text/javascript"
    src="<?php echo (SERVERURL); ?>plugins/jquery-pagination/jquery.Pagination.min.js?v=0.02"></script>

	<script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/util/configuration_api.js?v=0.02"></script>
    <script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/util/functions_operational.js?v=0.02"></script>

	<script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/util/functions.js?v=0.02"></script>
	<script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/init_parameters.js?v=0.54"></script>
	<script type="text/javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/session/js.cookie.js?v=0.23"></script>
	<script type="text/javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/session/session.validate.init.js?v=0.23"></script>
	<script type="text/javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/session/session.validate.js?v=0.02"></script>

<?php
//INCLUIMOS LOS SCRIPTS
$array_scripts = $beanResource->path_scripts;
if ($array_scripts !=
    "") {foreach ($array_scripts as $path_script) {echo '
    <script type="text/javascript" src="' . $path_script . '"></script>
    ';}}
?>
</body>

</html>
