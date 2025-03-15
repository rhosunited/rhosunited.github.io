const fetch = require('cross-fetch');
const yaml = require('write-yaml');
const endpoint = process.env.SENIORS_API_CALL;

function processName(reg) {
    return reg.firstName.split(" ")[0] + ' ' + reg.lastName;
}

const personsToExclude = [100615, 196419, 122020, 12952];

fetch(endpoint)
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(results => {
        let staff = [];
        let players = [];

        let registrations = results.results;
        registrations.forEach(registration => {
            if (personsToExclude.includes(registration.personId)) {
                return;
            }
            if (registration.registrationCategory === 'Coach' && registration.registrationStatus === 'CONFIRMED') {
                //console.log('FULL COACH REG: ', registration);
                let name = processName(registration);
                let coach = {
                    personId: registration.personId,
                    name: name,
                    role: registration.registrationType,
                    photo: registration.photo
                }
                // console.log(`COACH: ${name} - ${registration.registrationType} - ${registration.photo}`);
                staff.push(coach);
            }
            if (registration.registrationCategory === 'Player' && registration.registrationStatus === 'CONFIRMED') {
                // console.log('FULL PLAYER REG: ', registration);
                let name = processName(registration);
                let player = {
                    personId: registration.personId,
                    name: name,
                    photo: registration.photo
                }
                // console.log(`PLAYER: ${name} - ${registration.photo}`);
                players.push(player);
            }
        });
        var output = {
            staff: staff,
            players: players
        }
        console.log('Staff = ', staff.length);
        console.log('Players = ', players.length);
        yaml.sync('../data/seniors.yml', output);
    })
    .catch(err => {
        console.error(err);
    });

