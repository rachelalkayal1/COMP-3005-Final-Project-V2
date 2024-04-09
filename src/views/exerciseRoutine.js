function submit(){
    let dateOfLift = document.getElementById('dateOfLift').value;
    let nameOfLift = document.getElementById('nameOfLift').value;
    let formOfCardio = document.getElementById('cardio').value;
    let duration = parseInt(document.getElementById('duration').value)

    let allInfo = {dateOfLift:dateOfLift, nameOfLift:nameOfLift, formOfCardio:formOfCardio, duration:duration};
    let submitRequest = new XMLHttpRequest();
    submitRequest.open("POST", "/submitExerciseRoutine", true);
    submitRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    submitRequest.onreadystatechange = function(){
        if(submitRequest.readyState === 4 && submitRequest.status === 200){
            var information = document.getElementById('previousLogs');
            information.style.display = "none";
            information.style.display = "block";
            window.location.reload();
        }
    };
    submitRequest.send(JSON.stringify(allInfo));

}

// function previousDate(){

// }