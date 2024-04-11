function submit(){
    let dateOfAvailability = document.getElementById('dateOfAvailability').value;
    let startTime = document.getElementById('pickStartTime').value;
    let endTimeResult = document.getElementById('endTime').value;
    endTime = endTimeResult + 2;
    let schedulingInfo = {dateOfAvailability : dateOfAvailability, startTime : startTime, endTime : endTime}
    let submitRequest = new XMLHttpRequest();
    submitRequest.open("POST", "/setSchedule", true);
    submitRequest.setRequestHeader("Content-Type", "application/json");

    submitRequest.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            var information = document.getElementById('scheduleManagement');
            information.style.display = "none";
            information.style.display = "block";
            window.location.reload();
        }
    }
    submitRequest.send(JSON.stringify(schedulingInfo));

}