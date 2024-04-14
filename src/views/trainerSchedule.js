function submit(){
    let dateOfAvailability = document.getElementById('dateOfAvailability').value;
    let startTime = document.getElementById('pickStartTime').value;
    let startTimeParts = startTime.split(':');
    let hours = parseInt(startTimeParts[0]);
    let minutes = parseInt(startTimeParts[1]);
    hours += 2;
    let endTime = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
    let schedulingInfo = {dateOfAvailability : dateOfAvailability, startTime : startTime, endTime : endTime}
    document.getElementById('endTime').value = endTime;


    // let date = new Date(dateOfAvailability);
    // date = date.toISOString(); 
    // date.toString();
    // date = date.split("T"); 
    // date = date[0];

    let submitRequest = new XMLHttpRequest();
    submitRequest.open("POST", "/setSchedule", true);
    submitRequest.setRequestHeader("Content-Type", "application/json");
    console.log(startTime);
    console.log(endTime);
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