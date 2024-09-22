const fetch = require('cross-fetch');
const yaml = require('write-yaml');
const endpoint = process.env.API_CALL;

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
        var table_teams = teams.map(team => {
            return {
                position: team.position,
                team: team.club,
                points: team.points,
                played: team.matches,
                wins: team.wins,
                draws: team.draws,
                losses: team.losses
            };
        });
        var table = {
            table: table_teams
        }
        // console.log("table: ", table);
        yaml.sync('table.yaml', table);
    })
    .catch(err => {
        console.error(err);
    });

