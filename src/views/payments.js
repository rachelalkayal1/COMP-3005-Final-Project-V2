function makePayment(){
    let paymentAmount = document.getElementById('paymentamountclasses').value;
    let paymentDue = document.getElementById('paymentdueclasses').value;
    let paymentInformation = {paymentAmount : paymentAmount, paymentDue : paymentDue};
    let paymentRequest = new XMLHttpRequest();
    paymentRequest.open("POST", "/makePaymentMember", true);
    paymentRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    paymentRequest.onreadystatechange = function(){
        if(paymentRequest.readyState === 4 && paymentRequest.status === 200){
            alert("Payment successful");
            window.location.reload();
        }
    }
    paymentRequest.send(JSON.stringify(paymentInformation));
}

function monthlyPayment(){
    let monthlyFeeAmount = document.getElementById('monthlyFeeAmount').value;
    let monthlyFeeDue = document.getElementById('monthlyFeeDue').value;
    let paymentInformation = {monthlyFeeAmount : monthlyFeeAmount, monthlyFeeDue : monthlyFeeDue};
    let paymentRequest = new XMLHttpRequest();
    paymentRequest.open("POST", "/makeMonthlyPayment", true);
    paymentRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    paymentRequest.onreadystatechange = function(){
        if(paymentRequest.readyState === 4 && paymentRequest.status === 200){
            alert("Payment successful");
            window.location.reload();
        }
    }
    paymentRequest.send(JSON.stringify(paymentInformation));

}