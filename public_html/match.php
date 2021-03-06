<html>
<head>
    <?php include 'includes/header.php';?>
    <script src="js/match.js"></script>
    <script src="js/ranking.js"></script>
    <script src="js/location.js"></script>
    <script src="js/home.js"></script>
    <script src="js/profiles.js"></script>
    <script src="js/matches.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE0NXJejZApujcdK8c9S7i-G7yblT2kFg&libraries=places&callback=initMap" async defer></script>
    <title>LoudStand</title>

</head>
<style>
    body:before {
        background: url("https://i.ebayimg.com/images/g/m6IAAOSwoydWo8qE/s-l1600.jpg") no-repeat center center;
    }
</style>
<body onload="initMatch();initMatches(false);tutorialMatchInteractions();">

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-593ZT37"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->

<div id="tutorial" onclick="$('#tutorial').fadeOut();">
    <div id="tutorialcontent">
        <div id="closetutorial" onclick="$('#tutorial').fadeOut();">X</div>
        <b>LOUDSTAND TUTORIAL</b>
        <br>
        <h1>#5 - Matches Interaction</h1>
        <br>

        <p>You have checked-in, so now you are inside the virtual stadium! The match events will start popping up in
            your screen. All you have to do is react to the event with one click. So let’s say there is a substitution!
            The event pops up and you just need to vote up or down to give your opinion about the coach decision.
            One second later the overall fan opinion shows up.</p>

           <p><b>Swipe right</b> to see all the match events in one place! So if you have missed some of
            the  events during the match, you can still react to them in this screen!</p>

            <p><b>Swipe left</b> to find the most accurate Match Statistics of the match.</p>

            <p>If you are watching the match in one the LoudStand partners remember to use your discount vouchers
                in the bottom of the screen.</p>

        <p>Enjoy the match, and may the glory be with your team! :)</p>


    </div>
</div>

<div class="modal" id="checkinconfirmoverlay" style="height: 30%">
    <div class="modal-dialog">
        <div class="modal-content" id="matchmodal">
            <!-- Modal body -->
            <div id="checkinconfirm" class="modal-body">
            </div>
            <!-- Modal footer -->
            <div class="modal-footer">
                <button type="button" id ="checkinconfirmbutton" class="btn">Confirm</button>
                <button type="button" class="btn checkinclose" onclick="checkinClose()">Close</button>
            </div>
        </div>
    </div>
</div>

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
    <div id="firstsubtopnavmatchinteraction">
        <div class="menu-icon">
            <a href="matches.php"><img src="img/back.png"></a>
        </div>
        <div class="menu-title" onclick="overlayOff();">VIRTUAL STADIUM</div>
    </div>
    <div id="onmatchcheckin">Check-in</div>
</div>

<!--

<div class="overlay"></div>
<div id="news"></div>
<div id="teamprofile" class="matches">
	<div id='ownteamranking'></div>
	<div id='matches'>
		<h2>My Matches</h2>

		-->
<div id='overlay' class="overlay animated fadeIn" style="padding-top: 40px;">
    <input id="pac-input" class="controls" type="text" placeholder="Search location...">

    <div id="map"></div>
    <div id="results"></div>
    <div id="placesresult" style="display:none;"></div>
</div>

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
<div id="voucheroverlaycontentborder" class="animated fadeIn"></div>
<div id="voucheroverlaycontent" class="animated fadeIn">
    <div id="closetutorial" onclick="$('#voucheroverlay').fadeOut(); $('#voucheroverlaycontent').fadeOut();">X</div>
    <div class="vouchertitle"><h1>DISCOUNT</h1></div>
    <div id="voucheroverlayinnercontent">
        <div id="voucherdescription"></div>
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
    <div id="latestgameevent">
        <div id="waitinglatestevent" class="eventbox activityboxmatchevents" style="display: none">Match events will pop up here</div>
    </div>
    <div id="teamprofile" style="margin-top: 10px;">
        <div id='ownteamranking' style="display: none;"></div>
        <div id='squad' class="starting11 activitybox">
            <div class="activityheader">
                <h3>PRE-MATCH INTERACTION</h3>
                <h2>Suggest your starting 11</h2>
            </div>
            <div id ="startingstarting" class='starting'>
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
            <div class="activityheader">
                <h3 id="activitiyheader1">POST-MATCH INTERACTION</h3>
                <h2 id="activitiyheader2">How did your team do?</h2>
            </div>
            <div id='startingbenchcontainer' class="innercontainer">

                <div id="mvp">
                    <h2 id="mvptitle" class="animated fadeIn" style='color:#0F281D; font-weight: 200;'>Who was the best player in the match?<br></h2>
                    <div id='upcoming'>
                        <div id='homesquad'>
                            <div id="startingtoMVP" class='starting'>
                                Starting 11
                                <div class='keeper'></div>
                                <div class='defender'></div>
                                <div class='midfielder'></div>
                                <div class='striker'></div>
                            </div>
                            <div class="bench">
                                <p>Bench</p>
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
                console.log(swiper.previousIndex);
            }

            if (swiper.activeIndex == 1) {
                $(".menu-title").text("VIRTUAL STADIUM");
                if(swiper.previousIndex != 0){
                showLastGameEvent();
                }
            }

            if (swiper.activeIndex == 2) {
                $(".menu-title").text("MATCH EVENTS");
                appendLastGameEventToList();
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