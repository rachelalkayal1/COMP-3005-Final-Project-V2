function updateWeight() {
    let newWeight = document.getElementById('updatedWeight').value;
    let weightRequest = new XMLHttpRequest();
    weightRequest.open("POST", "/updateWeight", true);
    weightRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    weightRequest.onreadystatechange = function () {
        if (weightRequest.readyState === 4 && weightRequest.status === 200) {
            var information = document.getElementById('memberInfo');
            information.style.display = "none";
            information.style.display = "block";
            window.location.reload();
        }
    };
    weightRequest.send(JSON.stringify({newWeight:newWeight}));
}

function updateHeight() {
    let newHeight = document.getElementById('updatedHeight').value;
    let heightRequest = new XMLHttpRequest();
    heightRequest.open("POST", "/updateHeight", true);
    heightRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    heightRequest.onreadystatechange = function () {
        if (heightRequest.readyState === 4 && heightRequest.status === 200) {
            window.location.reload();
        }
    };
    heightRequest.send(JSON.stringify({newHeight:newHeight}));
}