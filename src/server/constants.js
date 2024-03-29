const TIMEOUT = 30000;
const TURNTIME = 60;

const STATUS = {
    UNKNOWN : "unknown",
    CONNECTED : "connected",
    DISCONNECTED : "disconnected",
    PLAYING : "waiting",
    READY : "ready",
}

const ACTION_EVENTS = {
    SUCCESS : "success",
    FAILURE : "failure",
    EFFECT : "effect",
    MESSAGE : "message"
}

const PLAYER_EFFECT = {
    RESTED: "rested"
}

module.exports = { TIMEOUT, TURNTIME, STATUS, ACTION_EVENTS, PLAYER_EFFECT }