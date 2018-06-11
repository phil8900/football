<html>
<head>
    <?php include 'includes/header.php';?>
    <script src="js/index.js"></script>

    <script src="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.js"></script>
    <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.css" />
    <script src="js/firebaseui.js"></script>
    <title>LoudStand</title>
</head>

<body>

<div id="welcome">
    <div id="welcometitle" class="animated fadeIn">
        <h1>Welcome to LoudStand</h1>
        <h2>THE ULTIMATE FAN EXPERIENCE</h2>
    </div>
    <div id="getstarted" class="animated fadeIn" onclick="welcomeOffAnimation();">
        <p>Get Started</p>
    </div>
</div>

<div id="authentication">
    <h1>Sign-Up</h1>
    <h2>CREATE A LOUDSTAND ACCOUNT</h2>
    <div id="loader">Loading...</div>
    <div id="firebaseui-auth-container"></div>
</div>
</body>
</html>