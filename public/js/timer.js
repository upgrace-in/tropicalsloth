// var countDownDate = new Date("Sep 13, 2022 11:00:00 GMT+05:30").getTime();
// // var countDownDate = new Date("Sep 16, 2022 11:00:00").getTime();

// // Update the count down every 1 second
// var x = setInterval(function () {

//     // Get today's date and time
//     // var now = new Date().getTime();
//     var now = new Date(date.getTime());

//     // Find the distance between now and the count down date
//     var distance = countDownDate - now;

//     // Time calculations for days, hours, minutes and seconds
//     var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//     var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//     // Display the result in the element with id="demo"
//     $(".timer").html(days + "d : " + hours + "h : " + minutes + "m : " + seconds + "s ");

//     // If the count down is finished, write some text
//     if (distance < 0) {
//         clearInterval(x);
//         $('.timer').hide()
//         $('.whitelistedBTN').hide()
//         $('.mintHead').hide()
//         $('#mintDiv').removeClass('hidden')
//     }
// }, 1000);