<html>
<head>
<?php include 'includes/header.php';?>
    <script src="js/index.js"></script>

    <script src="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.js"></script>
<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.css" />
<script src="js/firebaseui.js"></script>
</head>

<body>

<div id="welcome">
<h1>Welcome to LoudStand</h1>
<div id="getstarted" onclick="goToAuthentication();">LET'S START</div>
</div>

<div id="authentication">
<h1>AU Football</h1>
<div id="loader">Loading...</div>
<div id="firebaseui-auth-container"></div>
</div>
</body>
</html>