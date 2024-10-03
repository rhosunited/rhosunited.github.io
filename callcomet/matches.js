const fetch = require('cross-fetch');
const moment = require('moment');
const yaml = require('write-yaml');
const common = require('./common');
const endpoint = process.env.MATCHES_API_CALL;

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
                let scoreRegex = /\d+:\d+/;
                let hometeam = "";
                let awayteam = "";
                if (match.homeTeam == 31573) {
                    let teams = match.matchDescription.split('Rhos United');
                    hometeam = "Rhos United";
                    awayteam = teams[1].replace(scoreRegex, '').substring(2).trim();
                } else if (match.awayTeam == 31573) {
                    let teams = match.matchDescription.split('Rhos United');
                    hometeam = teams[0].substring(0, teams[0].length-2).trim();
                    awayteam = "Rhos United";
                }
                let score = match.matchDescription.match(scoreRegex);
                let homescore = score[0].split(':')[0];
                let awayscore = score[0].split(':')[1];
                let matchDate = moment(match.matchDate).toDate();
                let ground = match.facility;
                if (ground.includes("Betws Yn Rhos")) {
                    ground = "Betws Yn Rhos";
                }
                let competition = match.name;
                // console.log(`RESULT: [${hometeam}] ${homescore}-${awayscore} [${awayteam}] - ${matchDate} - ${ground} - ${competition}`);
                let matchDetails = {
                    hometeam: hometeam,
                    hometeamlogo: common.lookupBadge(match.homeTeam),
                    hometeamscore: homescore,
                    awayteam: awayteam,
                    awayteamlogo: common.lookupBadge(match.awayTeam),
                    awayteamscore: awayscore,
                    date: matchDate,
                    ground: ground,
                    competition: competition
                }
                matchResults.push(matchDetails);
            } else {
                // upcoming fixtures
                if (match.matchDate > 0) {
                    let hometeam = "";
                    let awayteam = "";
                    if (match.homeTeam == 31573) {
                        let teams = match.matchDescription.split('Rhos United');
                        hometeam = "Rhos United";
                        awayteam = teams[1].replace('-:-', '').substring(2).trim();
                        // console.log(match.matchDescription.split('Rhos United'));
                    } else if (match.awayTeam == 31573) {
                        let teams = match.matchDescription.split('Rhos United');
                        hometeam = teams[0].substring(0, teams[0].length-2).trim();
                        awayteam = "Rhos United";
                        // console.log(match.matchDescription.split('Rhos United'));
                    }
                    let matchDate = moment(match.matchDate).toDate();
                    let ground = match.facility;
                    if (ground.includes("Betws Yn Rhos")) {
                        ground = "Betws Yn Rhos";
                    }
                    if (ground === '') {
                        ground = "TBC";
                    }
                    let competition = match.name;
                    // console.log(`FIXTURE: [${hometeam}] v [${awayteam}] - ${matchDate} - ${ground} - ${competition}`);
                    let fixture = {
                        hometeam: hometeam,
                        hometeamlogo: common.lookupBadge(match.homeTeam),
                        awayteam: awayteam,
                        awayteamlogo: common.lookupBadge(match.awayTeam),
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

