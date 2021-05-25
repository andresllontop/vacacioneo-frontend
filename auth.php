<!DOCTYPE html>

<!--[if (gt IE 9)|!(IE)]><!-->
<html lang="es" class="no-js">
<!--<![endif]-->

<head>
    <meta charset="UTF-8" />
    <!-- <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">  -->
    <title>Login and Registration Form with HTML5 and CSS3</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Login and Registration Form with HTML5 and CSS3" />
    <meta name="keywords" content="html5, css3, form, switch, animation, :target, pseudo-class" />
    <meta name="author" content="Codrops" />
    <link rel="shortcut icon" href="../favicon.ico">
    <link rel="stylesheet" type="text/css" href="<?php echo SERVERURL; ?>vistas/subprojects/auth/asset/css/demo.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo SERVERURL; ?>vistas/subprojects/auth/asset/css/style3.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo SERVERURL; ?>vistas/subprojects/auth/asset/css/animate-custom.css" />
    <link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/bootstrap.css">
    <?php

$beanResource = $routes->getResourceForContainerAuth();
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
    <div class="container">
    <?php
//INCLUIMOS LOS HTML
$array_resource = $beanResource->path_resource;
if ($array_resource != "") {
    foreach ($array_resource as $path_resources) {
        include $path_resources;
    }}

?>

    </div>
    <script src="<?php echo SERVERURL; ?>vistas/js/vendor/jquery-2.2.4.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/popper.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/vendor/bootstrap.min.js"></script>
	<script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/util/configuration_api.js?v=0.01"></script>
    <script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/util/functions.js?v=0.01"></script>
    <script type="text/javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/session/js.cookie.js?v=0.23"></script>
    <script type="text/javascript"
        src="<?php echo (SERVERURL); ?>vistas/scripts/session/session.validate.login.js?v=0.23"></script>

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