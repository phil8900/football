var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
var userRanking;
var ownteam = JSON.parse(localStorage.getItem("loudstand_ownteam"));
var fixtures = JSON.parse(localStorage.getItem("loudstand_fixtures"));

var ownprofile = true;

function initProfiles(){

    if(uid == undefined){
        setTimeout(function(){initProfiles();}, 3000);
    }
    else{
        console.log(uid);

        var swiper = new Swiper('.swiper-container', {
            initialSlide: 0
        });

        swiper.on('slideChange', function () {
            if (swiper.activeIndex == 0) {
                $(".right").css('background-color', '#0F281D');
                $(".left").css('background-color', '#2c7656');

            }

            if (swiper.activeIndex == 1) {
                $(".left").css('background-color', '#0F281D');
                $(".right").css('background-color', '#2c7656');
            }

        });

        var passeduid = getQueryVariable("id");

        if(passeduid){
            uid = passeduid;
            ownprofile = false;
        }

        document.getElementById('profilebutton').src = 'img/user_select.svg';

        userRef.on('value', function(snapshot) {
            var array = new Array();
            snapshot.forEach(function(child) {
                if(child.val().team == ownteam){
                    array.push(child.val());
                }
            });

            array.sort(function(a, b){return b.points-a.points});
            userRanking = array;

            setUserProfile(userRanking);
        });
        getLastActivities();
        updateTeamRanking(true);

        firebase.database().ref('rankings/users/' + uid + '/team').on('value', function(snapshot){
            ownteam = snapshot.val();
            showSquad('');
        });
    }
    showCoachInformation();
    displayVouchers(true);

}

function showOwnProfile(snapshotvalue, entry){
    document.getElementById('ownprofile').innerHTML = '';
    var div = document.createElement('div');
    div.classList.add('container');


    var subcontainer = document.createElement('div');
    subcontainer.classList.add('row');
    div.appendChild(subcontainer);

    var imagewrapper = document.createElement('div');
    imagewrapper.classList.add('rankinglogowrapper');
    imagewrapper.classList.add('userteamlogo');
    imagewrapper.classList.add('col-xs-4');

    var userprofile = document.createElement('div');
    userprofile.id = 'userprofilephoto';
    userprofile.classList.add('userprofile');
    userprofile.classList.add('col-xs-4');
    userprofile.innerHTML = "user photo goes here";

    var rankdiv = document.createElement('div');
    rankdiv.id = 'rankdiv';
    rankdiv.classList.add('col-xs-4');
    var rankparagraph = document.createElement('p');

    var ranksymbol = document.createElement('i');
    ranksymbol.classList.add('fas');
    getTrend(entry, ranksymbol);

    rankparagraph.appendChild(ranksymbol);

    rankparagraph.appendChild(document.createTextNode(' ' + entry.rank));
    rankparagraph.id = 'ownteamrank';

    var ranktext = document.createElement('p');
    ranktext.appendChild(document.createTextNode('Fan ranking'));


    rankdiv.appendChild(rankparagraph);
    rankdiv.appendChild(ranktext);


    subcontainer.appendChild(rankdiv);
    subcontainer.appendChild(userprofile);
    subcontainer.appendChild(imagewrapper);
    div.appendChild(subcontainer);

    var image = document.createElement('img');
    image.src = snapshotvalue['teamlogo'];
    image.classList.add('rankinglogo');
    imagewrapper.appendChild(image);


    var teamdiv = document.createElement('div');
    var teamparagraph = document.createElement('p');
    teamparagraph.appendChild(document.createTextNode(entry.name));

    teamdiv.id = 'ownteamname';
    teamdiv.appendChild(teamparagraph);

    div.appendChild(teamdiv);

    var fanbasediv = document.createElement('div');
    var fanbaseparagraph = document.createElement('p');
    fanbaseparagraph.appendChild(document.createTextNode('FANDOM LEVEL'));
    fanbasediv.appendChild(fanbaseparagraph);
    fanbasediv.id = 'fandomlevel';

    var row = document.createElement('div');
    row.classList.add('row');
    var side = document.createElement('div');
    side.classList.add('side');
    row.appendChild(side);

    var middle = document.createElement('div');
    middle.classList.add('middle');
    row.appendChild(middle);

    var container = document.createElement('div');
    container.classList.add('bar-container');


    var bar = document.createElement('div');
    bar.id = 'fandombar';
    container.appendChild(bar);
    middle.appendChild(container);

    fanbasediv.appendChild(row);

    div.appendChild(fanbasediv);

    document.getElementById('ownprofile').appendChild(div);
    getBarValue();
}

function showBarValueUser(percentage){
    var bar = document.getElementById('fandombar');
    bar.style.width = (percentage/20) + '%';
    bar.innerHTML = percentage + 'pts';

}

function getBarValue(){

    firebase.database().ref('/rankings/users/' + uid + '/').once('value', function (snapshot){
        var totalpoints = snapshot.val()['points'];
        showBarValueUser(totalpoints);

    });
}






function getTrend(entry, ranksymbol){
    var symbol = 'fa-caret-right';
    var color = 'gray';

    if(entry['rank'] != -1){
        if(entry['rank'] < entry['rank']['previous']){
            symbol = 'fa-caret-up';
            color = 'green';
        }
        else if(entry['rank'] > entry['rank']['previous']){
            symbol = 'fa-caret-down';
            color = 'red';
        }
    }

    ranksymbol.classList.add(symbol);
    ranksymbol.style.color = color;
}

function setUserProfile(userRanking){
    var rank = 1;
    document.getElementById('ownprofile').innerHTML = '';
    userRanking.forEach(function(entry) {
        if(entry['rank'] == null){
            entry['previous'] = -1;
        }
        else{
            entry['previous'] = entry['rank']['rank'];
        }
        firebase.database().ref('rankings/users/' + entry.uid + '/rank').set({
            rank: rank
        });
        entry['rank'] = rank;
        rank++;
        if(entry.uid == uid){
            var teamRef = firebase.database().ref('teams/' + entry.team);
            teamRef.once('value', function(snapshot){
                showOwnProfile(snapshot.val()['information'], entry);
            });

        }
    });
}

function showActivityBox(activity, event, gameid, reaction){
    var wrapper = document.getElementById('activity');
    var timestamp = getTimestampForActivity(activity, event, reaction);
    var div = document.createElement('div');
    div.classList.add('activityboxmini');
    div.classList.add('reactionboxwrapper');
    div.id = timestamp;

    var paragraph = document.createElement('p');
    var symbol = document.createElement('i');
    symbol.classList.add('fas');
    symbol.classList.add('activityiconmini');
    paragraph.appendChild(symbol);
    div.appendChild(paragraph);
    var description = document.createElement('div');
    getActivityIcon(symbol, activity, description, event, gameid, reaction);

    div.appendChild(description);

    var activityarray = wrapper.getElementsByClassName('reactionboxwrapper');

    if(activityarray.length == 0){
        wrapper.appendChild(div);
    }
    else{
        [].forEach.call(activityarray, function (el) {
            if(timestamp < el.id){
                wrapper.appendChild(div);
            }
            else{
                wrapper.insertBefore(div, el);
            }
        });
    }
}

function getTimestampForActivity(activity, event, reaction){
    var timestamp = '';
    if(event != undefined){
        if(activity == 'checkin'){
            timestamp = event.timestamp;
        }
        else if(activity == 'reaction'){
            timestamp = reaction[uid].timestamp;
        }
        else if(activity == 'starting'){
            timestamp = event.timestamp;
        }
        else if(activity == 'finalcomment'){

        }
    }
    return timestamp;
}

function displayUserProfile(){

    var swiper = new Swiper('.swiper-container', {
        initialSlide: 1
    });

    $(".right").css('background-color', '#0F281D');
    $(".left").css('background-color', '#2c7656');

    swiper.slidePrev();

}

function displayTeamProfile(){
    var swiper = new Swiper('.swiper-container', {
        initialSlide: 0
    });

    $(".left").css('background-color', '#0F281D');
    $(".right").css('background-color', '#2c7656');

    swiper.slideNext();
}

function getActivityIcon(activitysymbol, activity, description, event, gameid, reaction){
    var symbol;
    var activitytext;

    if(activity == 'checkin'){
        symbol = 'fa-compass';
        activitytext = 'Checked in at';
        getCheckinDetails(description, activitytext, event);
    }
    else if(activity == 'reaction'){
        symbol = 'fa-comments';
        activitytext = 'Reacted to';
        getReactionDetails(description, event, activitytext, gameid, reaction);
    }
    else if(activity == 'starting'){
        symbol = 'fa-futbol';
        activitytext = 'Suggested starting 11';
        getStartingElevenDetails(description, event, activitytext, gameid);
    }
    else if(activity == 'finalcomment'){
        symbol = 'fa-comments';
        activitytext = 'Commented';
        getFinalCommentDetails(description, activitytext, event)
    }

    else if(activity == 'goal'){
        symbol = 'fa-futbol';
        activitytext = 'Rated the goal';
        getGoalDetails(description, activitytext, event)
    }

    else if(activity == 'mvap'){
        symbol = 'fa-trophy';
        activitytext = 'Voted for MVP';
        getMVPDetails(description, activitytext, event)
    }

    else if(activity == 'voucher'){
        symbol = 'fa-ticket-alt';
        activitytext = 'Used a LoudStand discount voucher at';
        getVoucherDetails(description, activitytext, event)
    }

    else if(activity == 'finalreview'){
        symbol = 'fa-star';
        activitytext = 'Rated the team performance';
        getFinalReviewlDetails(description, activitytext, event)
    }

    else if(activity == 'invitefriend'){
        symbol = 'fa-user-friends';
        activitytext = 'Invited to LoudStand';
        getInviteFriendDetails(description, activitytext, event)
    }

    activitysymbol.classList.add(symbol);
}

function getLastActivities() {
    firebase.database().ref('/fixtures/').once('value').then(function (snapshot) {
        snapshot.forEach(function (child) {
            var gameid = child.val().gameid;
            firebase.database().ref('/fixtures/' + gameid + '/events/').once('value', function (snapshot) {
                snapshot.forEach(function (child) {
                    firebase.database().ref('/fixtures/' + gameid + '/events/' + child.val().eventId + '/reactions/users').on('value', function (snapshot) {
                        var event = child.val();
                        if ((snapshot.val() != null) && (Object.keys(snapshot.val())[0] == uid)) {
                            showActivityBox('reaction', event, gameid, snapshot.val());
                        }
                    });
                });
            });
        });
    });

    firebase.database().ref('/checkins/').on('value', function (snapshot) {
        snapshot.forEach(function (child) {
            if (child.val()[uid] != null) {
                var key = Object.keys(child.val()[uid]);
                showActivityBox('checkin', child.val()[uid][key], null, null);
            }
        });
    });





    firebase.database().ref('/vouchers/waxxies/' + uid ).on('value', function (snapshot) {
        snapshot.forEach(function(child){
            if (child.val()[uid] != null) {
                var key = Object.keys(child.val()[uid]);
                showActivityBox('voucher', child.val()[uid][key], gameid, null);
            }
        });
    });


    firebase.database().ref('/fixtures/').once('value').then(function (snapshot) {
        snapshot.forEach(function (child) {
            var gameid = child.val().gameid;
            firebase.database().ref('/startingeleven/users/' + uid + '/' + gameid).once('value', function (snapshot) {
                snapshot.forEach(function (child) {
                    var key = child.val();
                    console.log(key);
                    if (child.val().timestamp != null) {
                        showActivityBox('starting', child.val(), child.key, null);
                    }
                });
            });
        });
    });




    firebase.database().ref('/startingeleven/users/' + uid).once('value', function (snapshot) {
        snapshot.forEach(function (child) {
            if (child.val().timestamp != null) {
                showActivityBox('starting', child.val(), child.key, null);
            }
        });
    });

    firebase.database().ref('/fixtures/').once('value').then(function (snapshot) {
        snapshot.forEach(function (child) {
            var gameid = child.val().gameid;
            firebase.database().ref('/startingeleven/users/' + uid + '/' + gameid + '/finalcomment/' ).once('value', function (snapshot) {
                snapshot.forEach(function (child) {
                    var finalcommentid = child.key;

                    firebase.database().ref('/startingeleven/users/' + uid + '/' + gameid + '/finalcomment/' + finalcommentid).once('value', function (snapshot) {
                        snapshot.forEach(function (child) {
                            showActivityBox('finalcomment', child.val(), child.key, null);

                        });

                        firebase.database().ref('/fixtures/' + gameid + '/events/').on('value', function (snapshot) {

                            snapshot.forEach(function (child) {
                                firebase.database().ref('/fixtures/' + child.val().gameid + '/events/' + child.key + '/stars/').on('value', function (snapshot) {
                                    snapshot.forEach(function (child){
                                        console.log(child.key); //I STOPPED HERE
                                    });

                                });
                            });

                        });


                    });

                });

            });
        });
    });


}

function getStartingElevenDetails(description, event, activitytext, gameid){
    setActivityText(description, activitytext);
    var eventwrapper = document.createElement('div');
    eventwrapper.classList.add('activitybox');
    eventwrapper.classList.add('activityreaction');
    var eventlist = document.createElement("div");
    eventlist.classList.add('eventlist');
    eventlist.classList.add('startinglist');

    var starting = document.createElement('div');

    Object.keys(event).forEach(function(child){
        if(child != 'timestamp'){
            var tmpevent = [];
            tmpevent['verein_id'] = ownteam;
            getPlayerInfo(event[child].playerid, tmpevent, eventlist);
        }
    });

    eventlist.appendChild(starting);
    eventwrapper.appendChild(eventlist);
    description.appendChild(eventwrapper);
}

function getCheckinDetails(description, activitytext, event){
    setActivityText(description, activitytext);
    var eventwrapper = document.createElement('div');
    eventwrapper.classList.add('activityreactionmini');
    var eventlist = document.createElement("div");
    eventlist.classList.add('eventlistmini');

    var placename = document.createElement('p');
    if(event != undefined){
        placename.appendChild(document.createTextNode(event.placename));
    }

    eventlist.appendChild(placename);
    eventwrapper.appendChild(eventlist);
    description.appendChild(eventwrapper);
}

function getFinalCommentDetails(description, activitytext, event){
    setActivityText(description, activitytext);
    var eventwrapper = document.createElement('div');
    eventwrapper.classList.add('activityreactionmini');
    var eventlist = document.createElement("div");
    eventlist.classList.add('eventlistmini');

    var finalcomment = document.createElement('p');
    //if(event != undefined){
    finalcomment.appendChild(document.createTextNode('"'+ event + '"'));
    //}

    eventlist.appendChild(finalcomment);
    eventwrapper.appendChild(eventlist);
    description.appendChild(eventwrapper);
}

function getGoalDetails(description, activitytext, event){
    setActivityText(description, activitytext);
    var eventwrapper = document.createElement('div');
    eventwrapper.classList.add('activityreactionmini');
    var eventlist = document.createElement("div");
    eventlist.classList.add('eventlistmini');

    var goal = document.createElement('p');
    //if(event != undefined){
    goal.appendChild(document.createTextNode(event));
    //}

    eventlist.appendChild(goal);
    eventwrapper.appendChild(eventlist);
    description.appendChild(eventwrapper);
}

function getVoucherDetails(description, activitytext, event){
    setActivityText(description, activitytext);
    var eventwrapper = document.createElement('div');
    eventwrapper.classList.add('activityreactionmini');
    var eventlist = document.createElement("div");
    eventlist.classList.add('eventlistmini');

    var voucher = document.createElement('p');
    //if(event != undefined){
    voucher.appendChild(document.createTextNode(event));
    //}

    eventlist.appendChild(voucher);
    eventwrapper.appendChild(eventlist);
    description.appendChild(eventwrapper);
}


function setActivityText(description, activitytext){
    var paragraph = document.createElement('p');
    paragraph.appendChild(document.createTextNode(activitytext));
    paragraph.classList.add('activitytextmini');
    description.appendChild(paragraph);
}

function getReactionDetails(description, event, activitytext, gameid, reaction){
    setActivityText(description, activitytext);
    var eventwrapper = document.createElement('div');
    eventwrapper.classList.add('activitybox');
    eventwrapper.classList.add('activityreaction');
    eventwrapper.id = event.eventId;

    getTeamInfo(gameid, eventwrapper);

    var score = document.createElement('div');
    var text = document.createTextNode(event.tore_h + ' : ' + event.tore_g);
    score.appendChild(text);
    score.classList.add('score');
    eventwrapper.appendChild(score);

    var eventlist = document.createElement("div");
    eventlist.classList.add('eventlist');

    var minutespan = document.createElement("div");
    var clock = document.createElement('i');
    clock.classList.add('fas');
    clock.classList.add('fa-stopwatch');
    minutespan.appendChild(clock);
    var minute = document.createTextNode(' ' + event.minute);
    minutespan.appendChild(minute);
    minutespan.classList.add('minute');
    eventlist.appendChild(minutespan);

    var typespan = document.createElement("div");
    var icon = getIconForEventType(event.type, event.subtype);
    typespan.appendChild(icon);

    eventlist.appendChild(typespan);

    firebase.database().ref('/teams/' + event.verein_id + '/information').once('value', function(snapshot) {
        var teamname = event.verein_id;
        var teamlogo = '';
        if(snapshot.val() != null){
            teamname = snapshot.val().teamname;
            teamlogo = snapshot.val().teamlogo;
        }
        var vereinspan = document.createElement("div");
        var logo = document.createElement('img');
        logo.classList.add('eventteamlogo');
        logo.src = teamlogo;
        vereinspan.appendChild(logo);
        var verein = document.createTextNode(' ' + teamname);
        vereinspan.appendChild(verein);
        vereinspan.classList.add('verein');
        eventlist.appendChild(vereinspan);
    });

    getPlayerInfo(event.spieler_id_1, event, eventlist);

    if(event.type == 'wechsel'){
        getPlayerInfo(event.spieler_id_2, event, eventlist);
    }

    eventwrapper.appendChild(eventlist);
    var reactionsymbol = document.createElement('i');
    reactionsymbol.classList.add('fas');
    if(reaction[uid].reaction == 'positive'){
        reactionsymbol.classList.add('fa-thumbs-up');
    }
    else{
        reactionsymbol.classList.add('fa-thumbs-down');
    }
    eventwrapper.appendChild(reactionsymbol);
    description.appendChild(eventwrapper);
}

function showSquad(nextgame){
    $('.userelement').show();

    var teamRef = firebase.database().ref('teams/' + ownteam + '/squad');
    ownprofile = true;

    var currenttime = Math.floor(Date.now() / 1000);

    fixtures.forEach(function(child) {
        if(child.timestamp > currenttime){
            if(nextgame == ''){
                nextgame = child.gameid;
            }
        }
    });

    teamRef.once('value', function(snapshot){
        snapshot.forEach(function(child){
            var player = child.val();

            var div;
            if(document.getElementById(player['playerid']) == null){
                div = document.createElement('div');
                div.id = player['playerid'];
            }
            else{
                div = document.getElementById(player['playerid']);
                div.innerHTML = '';
            }

            div.classList.add('userelement');
            var firstlinediv = document.createElement('div');
            firstlinediv.classList.add('firstlinediv');
            div.addEventListener("click", function(){
                showReactionOverview(player['playerid'], 'all');
            });

            var imagewrapper = document.createElement('div');
            imagewrapper.classList.add('playerimagewrapper');
            imagewrapper.style.backgroundImage="url('" + player['picture'] + "')";
            firstlinediv.appendChild(imagewrapper);

            var namespan = document.createElement('span');
            namespan.appendChild(document.createTextNode(player['fullname']));
            namespan.classList.add('userrankingname');

            firstlinediv.appendChild(namespan);

            var rankspan = document.createElement('span');
            rankspan.appendChild(document.createTextNode(player['status']));

            div.appendChild(firstlinediv);

            var pointsdiv = document.createElement('div');
            pointsdiv.appendChild(document.createTextNode(player['jerseynumber']));
            pointsdiv.classList.add('userrankingpoints');

            div.appendChild(pointsdiv);

            var countspan = document.createElement('span');
            countspan.classList.add('mvpcountspan');
            countspan.innerHTML = 0;
//	countspan.style.display = 'none';
            div.appendChild(countspan);

            var startingcountspan = document.createElement('span');
            startingcountspan.classList.add('startingcountspan');
            startingcountspan.innerHTML = 0;
            startingcountspan.style.display = 'none';
            div.appendChild(startingcountspan);

            var goalcountspan = document.createElement('span');
            goalcountspan.classList.add('goalcountspan');
            goalcountspan.innerHTML = 0;
//	goalcountspan.style.display = 'none';
            div.appendChild(goalcountspan);

            countVotes();

            if(ownprofile){
                var button = document.createElement('button');
                button.appendChild(document.createTextNode('11'));
                button.classList.add('checkinbutton');
                button.addEventListener("click", function(){
                    manageStartingEleven(button.parentElement.id, nextgame, button);
                });

                div.appendChild(button);
            }

            document.getElementById(getGeneralPosition(player['position'])).appendChild(div);
        });
        setupButtons(nextgame);
    });
    hideCheckinButtons();
}

function setupButtons(nextgame){
    var startingRef = firebase.database().ref('startingeleven/users/' + uid + '/' + nextgame);

    startingRef.on('value', function(snapshot){
        var counter = 0;
        snapshot.forEach(function(child) {
            if(child.val().playerid != null && child.key != 'mvp'){
                var div = document.getElementById(child.val().playerid);
                var button = div.getElementsByClassName('checkinbutton')[0];
                button.style.color = 'red';
                counter++;
            }
        });

        var all = document.getElementsByClassName('checkinbutton');
        for (var i = 0; i < all.length; i++) {
            if(counter == 11){
                if(all[i].style.color != 'red'){
                    all[i].disabled = true;
                    all[i].style.color = 'lightgray';

                    var updates = {};
                    updates['startingeleven/users/' + uid + '/' + nextgame + '/timestamp'] = Math.floor(Date.now() / 1000);
                    firebase.database().ref().update(updates);
                }
            }
            else if(all[i].style.color != 'red'){
                all[i].disabled = false;
                all[i].style.color = 'green';
            }
        }
    });
}

function manageStartingEleven(playerid, nextgame, button){
    console.log('Here');
    var startingRef = firebase.database().ref('startingeleven/users/' + uid + '/' + nextgame + '/' + playerid);
    var startingRootRef = firebase.database().ref('startingeleven/users/' + uid + '/' + nextgame);


    startingRef.once('value', function(snapshot){
        if(snapshot.val() == null){
            startingRef.set({
                playerid: playerid
            });
            button.style.color = 'red';
            startingRootRef.once('value', function(snapshot){
                var counter = 0;
                snapshot.forEach(function(child){
                    if(child.key != 'timestamp' && child.key != 'finalcomment' && child.key != 'finalreview' && child.key != 'mvp'){
                        counter++
                    }
                });
                
                if(counter == 11){
                    getPointsTable('suggest11');
                }
            });
        }
        else{
            firebase.database().ref('startingeleven/users/' + uid + '/' + nextgame + '/' + playerid).remove();
            firebase.database().ref('startingeleven/users/' + uid + '/' + nextgame + '/' + 'timestamp').remove();
            button.style.color = 'green';
            startingRootRef.once('value', function(snapshot){
                var counter = 0;
                snapshot.forEach(function(child){
                    if(child.key != 'timestamp' && child.key != 'finalcomment' && child.key != 'finalreview' && child.key != 'mvp'){
                        counter++
                    }
                });
                if(counter == 10){
                    getPointsTable('remove11');
                }
            });
        }
    })
}

function getGeneralPosition(position){
    var general = 'keeper';

    var defenders = ["Left-Back", "Centre-Back", "Right-Back"];
    var midfielders = ["Attacking Midfield", "Central Midfield", "Defensive Midfield", "Left Midfield", "Right Midfield"];
    var strikers = ["Centre-Forward", "Left Wing", "Right Wing", "Secondary Striker"];

    if(defenders.includes(position)){
        general = 'defender';
    }
    else if(midfielders.includes(position)){
        general = 'midfielder';
    }
    else if(strikers.includes(position)){
        general = 'striker';
    }

    return general;
}

function showReactionOverview(playerid, filter){
    firebase.database().ref('/teams/' + ownteam + '/information/fixtures').once('value').then(function(snapshot) {
        snapshot.forEach(function(child) {
            firebase.database().ref('/fixtures/' + child.val() + '/events/').once('value').then(function(snapshot) {
                var gameid = child.val();
                var ratingacc = 0;
                var playerevents = 0;
                snapshot.forEach(function(child) {
                    var event = child.val();
                    var gamerating;
                    if(playerid == event['spieler_id_1'] || playerid == event['spieler_id_2']){
                        if(event.type == filter || filter == 'all'){
                            playerevents++;
                            var negative = event['reactions']['negative'];
                            var positive = event['reactions']['positive'];
                            var percentage = 0;

                            if(negative == 0){
                                percentage = 100;
                            }
                            else if(negative > 0 && positive > 0){
                                percentage = (positive/(negative+positive)) * 100;
                            }

                            ratingacc += percentage;
                        }
                    }
                });
                if(playerevents>0){
                    var gamerating = {
                        "rating":ratingacc/playerevents,
                        "gameid":gameid,
                        "playerid":playerid,
                    };
                    createOverviewElement(gamerating);
                }

            });
        });
    });
}

function hideCheckinButtons(){
    $('.checkinbutton').hide();
}

function countVotes(type){
    getCoachStats();
    var teamRef = firebase.database().ref('teams/' + ownteam + '/squad').once('value', function(snapshot){
        snapshot.forEach(function(child){
            var playerid = child.val()['playerid'];
            countMvpvotes(playerid);
            countStarting(playerid);
            countReactions(playerid);
        });
    });
}

function showCoachInformation(){
    firebase.database().ref('teams/' + ownteam + '/information/coach').once('value', function(snapshot){
        var coach = document.getElementById('statscoach');
        var name = document.createElement('p');
        name.innerHTML = snapshot.val()['coachname'];
        coach.appendChild(name);

        var nationality = document.createElement('p');
        nationality.innerHTML = snapshot.val()['coachnationality'];
        coach.appendChild(nationality);

        var age = document.createElement('p');
        age.innerHTML = snapshot.val()['coachage'];
        coach.appendChild(age);

        var since = document.createElement('p');
        since.innerHTML = snapshot.val()['coachsince'];
        coach.appendChild(since);
    });
}

function getCoachStats(){
    firebase.database().ref('teams/' + ownteam + '/information/fixtures').once('value', function(snapshot){
        var positive = 0;
        var negative = 0;
        var coachrating = 0;
        snapshot.forEach(function(child){
            firebase.database().ref('fixtures/' + child.val() + '/events').once('value', function(snapshot){
                if(snapshot.val() != null){
                    snapshot.forEach(function(child){
                        if(child.val()['type'] == 'wechsel'){
                            var reactions = child.val()['reactions'];

                            positive = positive + reactions['positive'];
                            negative = negative + reactions['negative'];

                            if((positive+negative)>0){
                                coachrating = (positive/(negative+positive))*100;
                            }

                            var coachdiv = document.getElementById('statscoach');
                            if(coachdiv != null){
                                var coachcount = coachdiv.getElementsByClassName('coachcount')[0];
                                coachcount.innerHTML = coachrating + '%';
                            }
                        }
                    });
                }
            });
        });
    });
}

function countReactions(playerid){
    firebase.database().ref('teams/' + ownteam + '/information/fixtures').once('value', function(snapshot){
        var counter = 0;
        var goalrating = [];
        snapshot.forEach(function(child){
            firebase.database().ref('fixtures/' + child.val() + '/events').once('value', function(snapshot){
                if(snapshot.val() != null){
                    snapshot.forEach(function(child){
                        if(child.val()['spieler_id_1'] == playerid || child.val()['spieler_id_2'] == playerid){
                            if(child.val()['type'] == 'tor'){
                                var rating = child.val()['stars'];
                                if(rating != null){
                                    counter++;

                                    var five = rating['five'];
                                    var four = rating['four'];
                                    var three = rating['three'];
                                    var two = rating['two'];
                                    var one = rating['one'];

                                    var starrating = 0;

                                    var agg = five+four+three+two+one;
                                    if(agg > 0){
                                        var starrating = (5*five + 4*four + 3*three + 2*two + one)/(five+four+three+two+one);
                                    }

                                    if(goalrating[playerid] == null){
                                        goalrating[playerid] = starrating/counter;
                                    }
                                    else{
                                        goalrating[playerid] = (goalrating[playerid] + starrating)/counter;
                                    }

                                    var playerdiv = document.getElementById(playerid);
                                    var countspan = playerdiv.getElementsByClassName('goalcountspan')[0];
                                    countspan.innerHTML = goalrating[playerid];

                                }
                            }
                        }
                    });
                }
            });
        });
    });
}

function countMvpvotes(playerid){
    firebase.database().ref('startingeleven/users/').once('value', function(snapshot){
        var mvpcount = [];
        snapshot.forEach(function(child) {
            firebase.database().ref('startingeleven/users/' + child.key).once('value', function(snapshot){
                snapshot.forEach(function(child) {
                    if(child.val()['mvp'] != undefined){
                        if(playerid == child.val()['mvp']['playerid']){

                            if(mvpcount[playerid] == null){
                                mvpcount[playerid] = 1;
                            }
                            else{
                                mvpcount[playerid]++;
                            }
                            var playerdiv = document.getElementById(playerid);
                            var countspan = playerdiv.getElementsByClassName('mvpcountspan')[0];
                            countspan.innerHTML = mvpcount[playerid];
                        }
                    }
                });
            });
        });
    });
}

function countStarting(playerid){
    firebase.database().ref('startingeleven/users/').once('value', function(snapshot){
        var startingcount = [];
        snapshot.forEach(function(child) {
            firebase.database().ref('startingeleven/users/' + child.key).once('value', function(snapshot){
                snapshot.forEach(function(child) {
                    if(child.val()[playerid] != undefined){
                        if(startingcount[playerid] == null){
                            startingcount[playerid] = 1;
                        }
                        else{
                            startingcount[playerid]++;
                        }
                        var playerdiv = document.getElementById(playerid);
                        var countspan = playerdiv.getElementsByClassName('startingcountspan')[0];
                        countspan.innerHTML = startingcount[playerid];
                    }
                });
            });
        });
    });
}

function displayStatsMVP(){
    document.getElementById('statsmvp').style.display = 'block';
    document.getElementById('statsgoals').style.display = 'none';
    document.getElementById('statsbest11').style.display = 'none';
    document.getElementById('statscoach').style.display = 'none';
    document.getElementById('statsoverall').style.display = 'none';
    document.getElementById('dropdown').innerHTML = 'Man of the Match';

    $('.userelement:gt(2)').show();

    var players = $("#squad .userelement");

    var orderedDivs = players.sort(function (a, b) {
        return ($(a).find('.mvpcountspan').html() > $(b).find('.mvpcountspan').html()) ? -1 : ($(a).find('.mvpcountspan').html() < $(b).find('.mvpcountspan').html()) ? 1 : 0;
    });

    $("#statsmvp").html(orderedDivs);

    $('.userelement:gt(2)').hide();

}

function displayStatsGoals(){
    document.getElementById('statsmvp').style.display = 'none';
    document.getElementById('statsgoals').style.display = 'block';
    document.getElementById('statsbest11').style.display = 'none';
    document.getElementById('statscoach').style.display = 'none';
    document.getElementById('statsoverall').style.display = 'none';
    document.getElementById('dropdown').innerHTML = 'Goals';


    $('.userelement:gt(2)').show();

    var players = $("#squad .userelement");

    var orderedDivs = players.sort(function (a, b) {
        return ($(a).find('.goalcountspan').html() > $(b).find('.goalcountspan').html()) ? -1 : ($(a).find('.goalcountspan').html() < $(b).find('.goalcountspan').html()) ? 1 : 0;
    });

    $("#statsgoals").html(orderedDivs);

    $('.userelement:gt(2)').hide();
}

function displayStatsBest11(){
    document.getElementById('statsmvp').style.display = 'none';
    document.getElementById('statsgoals').style.display = 'none';
    document.getElementById('statsbest11').style.display = 'block';
    document.getElementById('statscoach').style.display = 'none';
    document.getElementById('statsoverall').style.display = 'none';
    document.getElementById('dropdown').innerHTML = 'Best 11';


    $('.userelement:gt(2)').show();

    var players = $("#squad .userelement");

    var orderedDivs = players.sort(function (a, b) {
        return ($(a).find('.startingcountspan').html() > $(b).find('.startingcountspan').html()) ? -1 : ($(a).find('.startingcountspan').html() < $(b).find('.startingcountspan').html()) ? 1 : 0;
    });

    $("#statsbest11").html(orderedDivs);

    $('.userelement:gt(10)').hide();
}

function displayStatsCoach(){
    document.getElementById('statsmvp').style.display = 'none';
    document.getElementById('statsgoals').style.display = 'none';
    document.getElementById('statsbest11').style.display = 'none';
    document.getElementById('statscoach').style.display = 'block';
    document.getElementById('statsoverall').style.display = 'none';
    document.getElementById('dropdown').innerHTML = 'Coach overall performance';

}

function displayStatsOverall(){
    document.getElementById('statsmvp').style.display = 'none';
    document.getElementById('statsgoals').style.display = 'none';
    document.getElementById('statsbest11').style.display = 'none';
    document.getElementById('statscoach').style.display = 'none';
    document.getElementById('statsoverall').style.display = 'block';
    document.getElementById('dropdown').innerHTML = 'Team overall performance';
    displayRatingStarsOverall();
}

function displayRatingStarsOverall(){
    firebase.database().ref('startingeleven/users/').once('value', function (snapshot) {
        var aggrating = 0;
        var counter = 0;
        snapshot.forEach(function(child){
            fixtures.forEach(function(game){
                if(child.val()[game.gameid] != undefined){
                    if(child.val()[game.gameid]['finalreview'] != undefined){
                        aggrating = aggrating + child.val()[game.gameid]['finalreview']['finalreview'];
                        counter++;
                    }

                }
            });
        });
            var rating = aggrating/counter;
            document.getElementById('statsoverall').appendChild(document.createTextNode(rating));
    });
}