const fetch = require('cross-fetch');
const moment = require('moment');
const yaml = require('write-yaml');
const endpoint = process.env.MATCHES_API_CALL;

function lookupBadge(team) {
    let badge = "";
    switch(team) {
        case 110255:
            badge = "/images/teamlogos/2425/bluebridge.png";
            break;
        case 31610:
            badge = "/images/teamlogos/2425/penrhynbay.jpg";
            break;
        case 31573:
            badge = "/images/logo.png";
            break;
        case 27071:
            badge = "/images/teamlogos/2425/henllan.jpg";
            break;
        case 109817:
            badge = "/images/teamlogos/2425/llandudno.jpg";
            break;
        case 31611:
            badge = "/images/teamlogos/2425/rhylalbion.jpg";
            break;
        case 31596:
            badge = "/images/teamlogos/2425/llysfaen.png";
            break;
        case 27632:
            badge = "/images/teamlogos/2425/prestatynsports.jpg";
            break;
        case 82925:
            badge = "/images/teamlogos/2425/prestatynwanderers.png";
            break;
        default:
            badge = "/images/generic_ball.png";
            break;
    }
    return badge;
}

function sortAsc(a, b) {
    if (a.date < b.date) {
        return -1;
    } else if (a.date > b.date) {
        return 1;
    } else {
        return 0;
    }
}

function sortDesc(a, b) {
    if (a.date < b.date) {
        return 1;
    } else if (a.date > b.date) {
        return -1;
    } else {
        return 0;
    }
}

fetch(endpoint)
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(results => {
        let fixtures = [];
        let matchResults = [];

        // console.log(results);
        let srcMatches = results.results;
        // // console.log(teams);
        srcMatches.forEach(match => {
            // results
            if (match.liveStatus == 'FULL_TIME') {
                let teams = match.matchDescription.split('-');
                let scoreRegex = /\d+:\d+/
                let hometeam = teams[0];
                let awayteam = teams[1].replace(scoreRegex, '');
                let score = match.matchDescription.match(scoreRegex);
                let homescore = score[0].split(':')[0];
                let awayscore = score[0].split(':')[1];
                let matchDate = moment(match.matchDate).toDate();
                let ground = match.facility;
                if (ground.includes("Betws Yn Rhos")) {
                    ground = "Betws Yn Rhos";
                }
                let competition = match.name;
                // console.log(`RESULT: ${hometeam} ${homescore}-${awayscore} ${awayteam} - ${matchDate} - ${ground} - ${competition}`);
                let matchDetails = {
                    hometeam: hometeam.trim(),
                    hometeamlogo: lookupBadge(match.homeTeam),
                    hometeamscore: homescore,
                    awayteam: awayteam.trim(),
                    awayteamlogo: lookupBadge(match.awayTeam),
                    awayteamscore: awayscore,
                    date: matchDate,
                    ground: ground,
                    competition: competition
                }
                matchResults.push(matchDetails);
            } else {
                // upcoming fixtures
                if (match.matchDate > 0) {
                    let teams = match.matchDescription.split('-');
                    let scoreRegex = /\d+:\d+/
                    let hometeam = teams[0];
                    let awayteam = teams[1].replace(scoreRegex, '');
                    let matchDate = moment(match.matchDate).toDate();
                    let ground = match.facility;
                    if (ground.includes("Betws Yn Rhos")) {
                        ground = "Betws Yn Rhos";
                    }
                    if (ground === '') {
                        ground = "TBC";
                    }
                    let competition = match.name;
                    // console.log(`FIXTURE: ${hometeam} ${awayteam} - ${matchDate} - ${ground} - ${competition}`);
                    let fixture = {
                        hometeam: hometeam.trim(),
                        hometeamlogo: lookupBadge(match.homeTeam),
                        awayteam: awayteam.trim(),
                        awayteamlogo: lookupBadge(match.awayTeam),
                        date: matchDate,
                        ground: ground,
                        competition: competition
                    }
                    // console.log(fixture);
                    fixtures.push(fixture);
                }
            }
        });
        fixtures.sort(sortAsc);
        let nextMatch = { ...fixtures[0], kickoff: moment(fixtures[0].date).format("yyyy-MM-DD hh:mm") };

        matchResults.sort(sortDesc);
        var output = {
            nextmatch: nextMatch,
            fixtures: fixtures,
            results: matchResults
        }
        // console.log("output: ", output);
        console.log('Results = ', matchResults.length);
        console.log('Fixtures = ', fixtures.length);
        yaml.sync('../data/matches.yml', output);
    })
    .catch(err => {
        console.error(err);
    });
