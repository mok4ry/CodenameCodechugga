function validateForms(room, pass, user) {
    var success = true;
    if(!room) {
        success = false;
        document.getElementById('roomname').style.borderColor = "red";
    }
    if(!pass) {
        success = false;
        document.getElementById('password').style.borderColor = "red";
    }
    if(!user) {
        success = false;
        document.getElementById('username').style.borderColor = "red";
    }
    return success;
}

function resetForms() {
    document.getElementById('roomname').style.borderColor = "";
    document.getElementById('password').style.borderColor = "";
    document.getElementById('username').style.borderColor = "";
}