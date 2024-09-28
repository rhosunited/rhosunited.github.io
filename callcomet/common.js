module.exports = {
    lookupBadge: function(team) {
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
    },


}