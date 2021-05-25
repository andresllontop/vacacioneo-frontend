<!DOCTYPE html>
<html lang="es" class="no-js">

<head>
	<!-- Mobile Specific Meta -->
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<!-- Favicon-->
	<link rel="shortcut icon" href="<?php echo SERVERURL; ?>vistas/img/vacacioneo.png">
	<!-- Author Meta -->
	<meta name="author" content="colorlib">
	<!-- Meta Description -->
	<meta name="description" content="">
	<!-- Meta Keyword -->
	<meta name="keywords" content="">
	<!-- meta character set -->
	<meta charset="UTF-8">
	<!-- Site Title -->
	<title>VACACIONEO</title>

	<link href="https://fonts.googleapis.com/css?family=Poppins:100,200,400,300,500,600,700" rel="stylesheet">
	<!--
			CSS
			============================================= -->
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/linearicons.css">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/font-awesome.min.css">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/bootstrap.css">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/magnific-popup.css">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/jquery-ui.css">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/nice-select.css">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/animate.min.css">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/owl.carousel.css">
	<link rel="stylesheet" href="<?php echo SERVERURL; ?>vistas/css/main.css">
    <?php

$beanResource = $routes->getResourceForContainerPublico();
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
	<header id="header">
		<div class="header-top">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-lg-6 col-sm-6 col-6 header-top-left">

					</div>
					<div class="col-lg-6 col-sm-6 col-6 header-top-right">
						<div class="header-social">
						<a href="https://www.facebook.com/Vacacioneo-106358931591204" target="_blank"><i class="fa fa-facebook"></i></a>
					<a href="https://www.youtube.com/channel/UChN74YrZBE1ysTOg9qFjtAw" target="_blank"><i class="fa fa-youtube"></i></a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container main-menu">
			<div class="row align-items-center justify-content-between d-flex">
				<div id="logo">
					<a href="<?php echo SERVERURL; ?>home"><img style=" width: 33px; border-radius: 50%;" src="<?php echo SERVERURL; ?>vistas/img/vacacioneo.png" alt="" title="" /><span style="color:white;padding-left: 9px;font-size: 22px;font-weight: bold;">VACACIONEO</span></a>
				</div>
				<nav id="nav-menu-container">
					<ul class="nav-menu">
						<li><a href="<?php echo SERVERURL; ?>home">Home</a></li>
						<li><a href="<?php echo SERVERURL; ?>destino">Destinos</a></li>
						<!--li><a href="<?php echo SERVERURL; ?>about">Acerca de</a></li>
						<li><a href="<?php echo SERVERURL; ?>paquete">Paquetes</a></li-->
						<li><a href="<?php echo SERVERURL; ?>hotel">Hoteles</a></li>
						<!--li><a href="<?php echo SERVERURL; ?>restaurant">Restaurantes</a></li-->

						<li><a href="<?php echo SERVERURL; ?>contact">Contacto</a></li>
						<!--li><a href="<?php echo SERVERURL; ?>auth/login">Login</a></li-->
					</ul>
				</nav><!-- #nav-menu-container -->
			</div>
		</div>
	</header><!-- #header -->
    <?php
//INCLUIMOS LOS HTML
$array_resource = $beanResource->path_resource;
if ($array_resource != "") {
    foreach ($array_resource as $path_resources) {
        include $path_resources;
    }}

?>

	<!-- start footer Area -->
	<footer class="footer-area">
		<div class="container">

			<div class="row">
				<div class="col-lg-6  col-md-6 col-sm-6">
					<div class="single-footer-widget">
						<h6>ACERCA DE LA AGENCIA</h6>
						<p>
						Vacacioneo es un emprendimiento que fue creado para servir de guía turística, y así nuestros usuarios puedan disfrutar una increíble experiencia de viaje.
						</p>
					</div>
				</div>

				<div class="col-lg-6  col-md-6 col-sm-6">
					<div class="single-footer-widget">
						<h6>BOLETIN INFORMATIVO</h6>
						<Para profesionales de negocios atrapados entre un alto precio de OEM y una impresión y producción gráfica mediocres.
						</p>
						<div id="mc_embed_signup">
							<form target="_blank"
								action=""
								method="get" class="subscription relative">
								<div class="input-group d-flex flex-row">
									<input name="EMAIL" placeholder="Email Address" onfocus="this.placeholder = ''"
										onblur="this.placeholder = 'Email Address '" required="" type="email">
									<button class="btn bb-btn"><span class="lnr lnr-location"></span></button>
								</div>
								<div class="mt-10 info"></div>
							</form>
						</div>
					</div>
				</div>

			</div>

			<div class="row footer-bottom d-flex justify-content-between align-items-center">
				<p class="col-lg-8 col-sm-12 footer-text m-0">
					<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
					Copyright &copy;
					<script>document.write(new Date().getFullYear());</script> Todos los derechos reservados <i
						class="fa fa-heart-o" aria-hidden="true"></i> por <a href="#"
						>vacacioneo</a>
					<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
				</p>
				<div class="col-lg-4 col-sm-12 footer-social">
					<a href="https://www.facebook.com/Vacacioneo-106358931591204" target="_blank"><i class="fa fa-facebook"></i></a>
					<a href="https://www.youtube.com/channel/UChN74YrZBE1ysTOg9qFjtAw" target="_blank"><i class="fa fa-youtube"></i></a>
				</div>
			</div>
		</div>
	</footer>
	<!-- End footer Area -->

	<script src="<?php echo SERVERURL; ?>vistas/js/vendor/jquery-2.2.4.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/popper.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/vendor/bootstrap.min.js"></script>

	<script src="<?php echo SERVERURL; ?>vistas/js/jquery-ui.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/easing.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/hoverIntent.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/superfish.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/jquery.ajaxchimp.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/jquery.magnific-popup.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/jquery.nice-select.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/owl.carousel.min.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/mail-script.js"></script>
	<script src="<?php echo SERVERURL; ?>vistas/js/main.js"></script>


	<script type="text/javascript"
    src="<?php echo (SERVERURL); ?>plugins/jquery-pagination/jquery.Pagination.min.js?v=0.56"></script>

	<script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/util/configuration_api.js?v=0.01"></script>
    <script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/util/functions_operational.js?v=0.01"></script>
	<script language="javascript" src="<?php echo (SERVERURL); ?>vistas/scripts/init_parameters.js?v=0.54"></script>
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
