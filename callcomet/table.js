const fetch = require('cross-fetch');
const yaml = require('write-yaml');
const common = require('./common');
const endpoint = process.env.TABLE_API_CALL;

fetch(endpoint)
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(results => {
        let teams = results.results;
        // console.log(teams);
        var table = teams.map(team => {
            return {
                position: team.position,
                logo: common.lookupBadge(team.clubId),
                team: team.club,
                points: team.points,
                played: team.matches,
                wins: team.wins,
                draws: team.draws,
                losses: team.losses
            };
        });
        var output = {
            table: table
        }
        // console.log("table: ", table);
        console.log('Table = ', table.length);
        yaml.sync('../data/table.yml', output);
    })
    .catch(err => {
        console.error(err);
    });

