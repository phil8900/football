<html>
<head>
    <?php include 'includes/header.php';?>
    <script src="js/match.js"></script>
    <script src="js/ranking.js"></script>
    <script src="js/home.js"></script>
    <script src="js/profiles.js"></script>
    <script src="js/matches.js"></script>
</head>
<style>
    body:before {
        background: url("https://i.ebayimg.com/images/g/m6IAAOSwoydWo8qE/s-l1600.jpg") no-repeat center center;
    }
</style>
<body onload="initMatch();initMatches(false);">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->


<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
    <div class="firstsubtopnavmatchinteraction">
        <div class="menu-icon">
            <a href="matches.php"><img src="img/back.png"></a>
        </div>
        <div class="menu-title">VIRTUAL STADIUM</div>
    </div>
</div>

<!--

<div class="overlay"></div>
<div id="news"></div>
<div id="teamprofile" class="matches">
	<div id='ownteamranking'></div>
	<div id='matches'>
		<h2>My Matches</h2>

		-->


<div class="matchinteractionheader">

    <div id="centerpitchcontainter" class="container">
        <div id="centerpitchrow" class="row">
            <div class="col-xs-3">
                <span id="hometeam"></span>
                <span id="hometeamname"></span>
            </div>
            <div class="col-xs-6"></div>
            <div class="col-xs-3">
                <span id="awayteam"></span>
                <span id="awayteamname"></span>
            </div>
        </div>
    </div>

    <div id="centerpitch">
        <span id="currentscorehome"></span>
        <span id="currentscoreaway"></span>
        <br>
        <span id="liveminute"></span>
        <!--   <span id="location"></span> -->
    </div>
</div>


<div id="score">
    <div id="gameheader">
        <span id="hometeamflag"></span>

        <span id="awayteamflag"></span>
    </div>
</div>


<div id="voucheroverlay" class="animated fadeIn" onclick="hideVoucherOverlay();"></div>
<div id="voucheroverlaycontent" class="animated fadeIn">
    <div class="vouchertitle"><h1>DISCOUNT</h1></div>
    <div id="voucheroverlayinnercontent">
        <div id="voucherdescription">
        </div>
    </div>
</div>


<!-- Slider main container -->
<div class="swiper-container">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide matchinteraction" id="stats">
            <div id="statistics" class="activitybox">
                <div class="col-xs-2">
                    <div id="homepossession2"></div>
                    <div id="homeshotsoverall2"></div>
                    <div id="homeshotstarget2"></div>
                    <div id="homeshots2"></div>
                    <div id="homesaves2"></div>
                    <div id="homefouls2"></div>
                    <div id="homefreekicks2"></div>
                    <div id="homecorners2"></div>
                    <div id="homeoffisde2"></div>
                </div>
                <div class="col-xs-12 statscenter">
                    <div id="possession"><p style="margin-top: 0;">Ball possession</p>
                        <div class ="statscenter">
                            <div id="homepossession" class="innerstatshome"></div>
                            <div  id="awaypossession" class="innerstatsaway"></div>
                        </div>
                    </div>
                    <div id="shots">

                        <p>Total shots</p>
                        <div class ="statscenter">
                            <div id="homeshotsoverall" class="innerstatshome"></div>
                            <div id="awayshotsoverall" class="innerstatsaway"></div>
                        </div>

                        <p>Shots on goal</p>
                        <div class ="statscenter">
                            <div id="homeshotstarget" class="innerstatshome"></div>

                            <div id="awayshotstarget" class="innerstatsaway"></div>
                        </div>

                        <p>Shots off target</p>
                        <div class ="statscenter">
                            <div id="homeshots" class="innerstatshome"></div>
                            <div id="awayshots" class="innerstatsaway"></div>
                        </div>
                    </div>
                    <div id="saves">
                        <p>Saves</p>
                        <div class ="statscenter">
                            <div id="homesaves" class="innerstatshome"></div>
                            <div id="awaysaves" class="innerstatsaway"</div>
                    </div>
                    <div id="fouls">
                        <p>Fouls</p>
                        <div class ="statscenter">
                            <div id="homefouls" class="innerstatshome"></div>
                            <div id="awayfouls" class="innerstatsaway"></div>
                        </div>

                        <p>Free kicks</p>
                        <div class ="statscenter">
                            <div id="homefreekicks" class="innerstatshome"></div>
                            <div id="awayfreekicks" class="innerstatsaway"></div>
                        </div>

                    </div>
                    <div id="others">
                        <p>Corners</p>
                        <div class ="statscenter">
                            <div id="homecorners" class="innerstatshome"></div>
                            <div id="awaycorners" class="innerstatsaway"></div>
                        </div>

                        <p>Offsides</p>
                        <div class ="statscenter">
                            <div id="homeoffside" class="innerstatshome"></div>
                            <div id="awayoffside" class="innerstatsaway"></div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-2">
                    <div id="awaypossession2"></div>
                    <div id="awayshotsoverall2"></div>
                    <div id="awayshotstarget2"></div>
                    <div id="awayshots2"></div>
                    <div id="awaysaves2"></div>
                    <div id="awayfouls2"></div>
                    <div id="awayfreekicks2"></div>
                    <div id="awaycorners2"></div>
                    <div id="awayoffisde2"></div>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="swiper-slide matchinteraction">
    <div id="latestgameevent" class="maininteraction activitybox"></div>
    <div id="teamprofile">
        <div id='ownteamranking' style="display: none;"></div>
        <div id='squad' class="starting11 activitybox">
            <div class="activityheader">
                <h3>PRE-MATCH INTERACTION</h3>
                <h2>Suggest your starting 11</h2>
            </div>
            <div class='starting'>
                <div id='keeper'></div>
                <div id='defender'></div>
                <div id='midfielder'></div>
                <div id='striker'></div>
            </div>
            <div class="bench">
            </div>
        </div>
    </div>
    <br>

    <div id="interactions">
        <div id="postmatchcontainer" class="activitybox">
            <div class="activityheader"><h3>POST-MATCH INTERACTION</h3>
                <h2>How did your team do?</h2>
            </div>
            <div class="innercontainer">

                <div id="mvp">
                    <h2 class="animated fadeIn" style='color:#0F281D; font-weight: 200;'>Who was the best player in the match?<br></h2>
                    <div id='upcoming'>
                        <div id='homesquad'>
                            <div class='starting startingtoMVP'>
                                <div class='keeper'></div>
                                <div class='defender'></div>
                                <div class='midfielder'></div>
                                <div class='striker'></div>
                            </div>
                            <div class="bench">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</div>

<div class="swiper-slide matchinteraction">
    <div id="eventshistory">
        <div id="events"></div>
    </div>
</div>

<!--




-->

<?php include 'includes/footer.php';?>

<!-- CLEAN LATER -->

<script>

    $(document).ready(function() {

        swiper.on('slideChange', function () {

            if (swiper.activeIndex == 0) {
                $(".menu-title").text("STATS");
            }

            if (swiper.activeIndex == 1) {
                $(".menu-title").text("VIRTUAL STADIUM");
            }

            if (swiper.activeIndex == 2) {
                $(".menu-title").text("MATCH EVENTS");
            }

        })
    }); // end ready


</script>

<script>
    var swiper = new Swiper('.swiper-container', {
        initialSlide: 1
    });
</script>

<script src="https://code.jquery.com/jquery-3.2.0.min.js"></script>

</body>
</html>