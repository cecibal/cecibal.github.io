//// set the date we're counting down to
//var target_date = new Date('April, 31, 2021').getTime();
 
//// variables for time units
//var days, hours, minutes, seconds;
 
//// get tag element
//var countdown = document.getElementById('countdown');
 
//// update the tag with id "countdown" every 1 second
//setInterval(function () {
 
//    // find the amount of "seconds" between now and target
//    var current_date = new Date().getTime();
//    var seconds_left = (target_date - current_date) / 1000;
 
//    // do some time calculations
//    days = parseInt(seconds_left / 86400);
//    seconds_left = seconds_left % 86400;
     
//    hours = parseInt(seconds_left / 3600);
//    seconds_left = seconds_left % 3600;
     
//    minutes = parseInt(seconds_left / 60);
//    seconds = parseInt(seconds_left % 60);
     
//    // format countdown string + set tag value
//    countdown.innerHTML = '<span class="days">' + days +  ' <label>Days</label></span> <span class="hours">' + hours + ' <label>Hours</label></span> <span class="minutes">'
//    + minutes + ' <label>Minutes</label></span> <span class="seconds">' + seconds + ' <label>Seconds</label></span>';  
 
//}, 1000);


var durationRoundHours = 0;
var durationRoundMinutes = 0;
var durationRoundSeconds = 10;

var durationRestMinutes = 0;
var durationRestSeconds = 5;

var durationRounds = 10;

var countdownRound = durationRoundHours * 60 * 60 + durationRoundMinutes * 60 + durationRestSeconds;
var countdownRest = durationRestMinutes * 60 + durationRestSeconds;

var roundCounter = 0;
var isRunning = false;
var newValuesSaved = false;

var audio = new Audio();  //('sound_effect.mp3');

var countdownHandler;

function initValues() {
    durationRoundHours = localStorage.getItem('durationRoundHours') ? parseInt(localStorage.getItem('durationRoundHours')) : 0;
    durationRoundMinutes = localStorage.getItem('durationRoundMinutes') ? parseInt(localStorage.getItem('durationRoundMinutes')) : 0;
    durationRoundSeconds = localStorage.getItem('durationRoundSeconds') ? parseInt(localStorage.getItem('durationRoundSeconds')) : 45;

    durationRestMinutes = localStorage.getItem('durationRestMinutes') ? parseInt(localStorage.getItem('durationRestMinutes')) : 0;
    durationRestSeconds = localStorage.getItem('durationRestSeconds') ? parseInt(localStorage.getItem('durationRestSeconds')) : 45;

    durationRounds = localStorage.getItem('durationRounds') ? parseInt(localStorage.getItem('durationRounds')) : 10;

    countdownRound = durationRoundHours * 60 * 60 + durationRoundMinutes * 60 + durationRoundSeconds;
    countdownRest = durationRestMinutes * 60 + durationRestSeconds;

    isRunning = false;
    roundCounter = 1;
}


function startCountdown() {
    // if ($('#start_button').prop('disabled')) return;

    isRunning = true;
    $('#start_button').prop('disabled', true);
    //initValues();
    //roundCounter = 1;

    countdownHandler = setInterval(function () {       

        if (countdownRound > 0) {
            countdownRound--;
        }
        else {
            if (countdownRest > 0) {
                countdownRest--;
            }
        }
        // check if round ends and rest starts
        if (countdownRound === 0 && countdownRest === durationRestMinutes * 60 + durationRestSeconds) {
            $('#timer_display').css('color', '#0000FF');  // color == blue
            $('#counter_display').css('color', '#0000FF');  // color == blue
            playSound();
        }
        // check if end of round and play sound if true
        if (countdownRound === 0 && countdownRest === 0) {
            roundCounter++;
            countdownRound = durationRoundHours * 60 * 60 + durationRoundMinutes * 60 + durationRoundSeconds; // initialize again
            countdownRest = durationRestMinutes * 60 + durationRestSeconds;
            $('#timer_display').css('color', '#FFFFFF'); // color == white
            $('#counter_display').css('color', '#FFFFFF');
            playSound();
        }

        // display it 
        displayTimer();

        if (durationRounds  === roundCounter - 1) {
            resetCountdown();  //stops automatically after durationRounds achieved
        }
    }, 1000); // update display every second
}

function stopCountdown() {
    isRunning = false;
    if (countdownHandler) {
        clearInterval(countdownHandler);
    }
    $('#timer_display').css('color', '#FFFFFF'); // color == white
    $('#counter_display').css('color', '#FFFFFF');
    $('#start_button').prop('disabled', false);
}

function resetCountdown() {
        
    stopCountdown();

    initValues();

    displayTimer();
}

function padNumber(number, size) {
    var s = "00" + number;
    return s.substr(s.length - size);
}

function displayTimer() {
    var hour = 0, minute = 0, second = 0;
    if (countdownRound > 0) {
        hour = parseInt(countdownRound / 60 / 60);
        minute = parseInt((countdownRound - (hour * 60 * 60)) / 60);
        second = parseInt((countdownRound - (hour * 60 * 60)) - (minute * 60));
    }
    else {
        hour = parseInt(countdownRest / 60 / 60);
        minute = parseInt((countdownRest - (hour * 60 * 60)) / 60);
        second = parseInt((countdownRest - (hour * 60 * 60)) - (minute * 60));
    }
    $('#timer_display').text((hour > 0 ? padNumber(hour, 2) + ':'  : '') + padNumber(minute, 2) + ':' + padNumber(second, 2));
    $('#counter_display').text((countdownRound > 0 ? 'Round: ' : 'Rest: ') + roundCounter);
}

function saveSettings() {

    if (isRunning) {
        if (!confirm('Cannot save while running. Stop timer?'))
            return;

        resetCountdown();
    }

    var roundHours = parseInt($('#round_duration_hours').val() ? $('#round_duration_hours').val() : 0 );
    var roundMinutes = parseInt($('#round_duration_minutes').val() ? $('#round_duration_minutes').val() : 0);
    var roundSeconds = parseInt($('#round_duration_seconds').val() ? $('#round_duration_seconds').val() : 0);

    var restMinutes = parseInt($('#rest_duration_minutes').val() ? $('#rest_duration_minutes').val() : 0);
    var restSeconds = parseInt($('#rest_duration_seconds').val() ? $('#rest_duration_seconds').val() : 0);

    var trainingRounds = parseInt($('#training_duration_rounds').val() ? $('#training_duration_rounds').val() : 0);

    newValuesSaved = durationRoundHours != roundHours;
    durationRoundHours = roundHours;
    newValuesSaved |= durationRoundMinutes != roundMinutes;
    durationRoundMinutes = roundMinutes;
    newValuesSaved |= durationRoundSeconds != roundSeconds;
    durationRoundSeconds = roundSeconds;
    localStorage.setItem('durationRoundHours', durationRoundHours);
    localStorage.setItem('durationRoundMinutes', durationRoundMinutes);
    localStorage.setItem('durationRoundSeconds', durationRoundSeconds);

    newValuesSaved |= durationRestMinutes != restMinutes;
    durationRestMinutes = restMinutes;
    newValuesSaved |= durationRestSeconds != restSeconds;
    durationRestSeconds = restSeconds;
    localStorage.setItem('durationRestMinutes', durationRestMinutes);
    localStorage.setItem('durationRestSeconds', durationRestSeconds);

    newValuesSaved |= durationRounds != trainingRounds;
    durationRounds = trainingRounds;
    localStorage.setItem('durationRounds', durationRounds);

    var trainingDurationSeconds = (roundHours * 60 * 60 + roundMinutes * 60 + roundSeconds
        + restMinutes * 60 + restSeconds) * trainingRounds;

    var trainingHours = parseInt(trainingDurationSeconds / 60 / 60);
    var trainingMinutes = parseInt((trainingDurationSeconds - (trainingHours * 60 * 60)) / 60);
    var trainingSeconds = (trainingDurationSeconds - (trainingHours * 60 * 60)) - trainingMinutes * 60;

    $('#training_duration_hours').val(padNumber(trainingHours, 2));
    $('#training_duration_minutes').val(padNumber(trainingMinutes, 2));
    $('#training_duration_seconds').val(padNumber(trainingSeconds, 2));
}


function initSettings()
{
    durationRoundHours = parseInt(!localStorage.getItem('durationRoundHours') ? 0 : localStorage.getItem('durationRoundHours'));
    durationRoundMinutes = parseInt(!localStorage.getItem('durationRoundMinutes') ? 0 : localStorage.getItem('durationRoundMinutes'));
    durationRoundSeconds = parseInt(!localStorage.getItem('durationRoundSeconds') ? 45 : localStorage.getItem('durationRoundSeconds'));
	
	$('#round_duration_hours').val(padNumber(durationRoundHours, 2));
	$('#round_duration_minutes').val(padNumber(durationRoundMinutes, 2));
	$('#round_duration_seconds').val(padNumber(durationRoundSeconds, 2));
	
    durationRestMinutes = parseInt(!localStorage.getItem('durationRestMinutes') ? 0 : localStorage.getItem('durationRestMinutes'));
    durationRestSeconds = parseInt(!localStorage.getItem('durationRestSeconds') ? 45 : localStorage.getItem('durationRestSeconds'));
	
	$('#rest_duration_minutes').val(padNumber(durationRestMinutes, 2));
	$('#rest_duration_seconds').val(padNumber(durationRestSeconds, 2));
    
	durationRounds = parseInt(!localStorage.getItem('durationRounds') ? 10 : localStorage.getItem('durationRounds'));
	
	$('#training_duration_rounds').val(durationRounds);
    
	var trainingDurationSeconds = (durationRoundHours * 60 * 60 + durationRoundMinutes * 60 + durationRoundSeconds
        + durationRestMinutes * 60 + durationRestSeconds) * durationRounds;

    var trainingHours = parseInt(trainingDurationSeconds / 60 / 60);
    var trainingMinutes = parseInt((trainingDurationSeconds - (trainingHours * 60 * 60)) / 60);
    var trainingSeconds = (trainingDurationSeconds - (trainingHours * 60 * 60)) - trainingMinutes * 60;

    $('#training_duration_hours').val(padNumber(trainingHours, 2));
    $('#training_duration_minutes').val(padNumber(trainingMinutes, 2));
    $('#training_duration_seconds').val(padNumber(trainingSeconds, 2));
}

$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    if (e.target.id == 'timer-tab' && !isRunning && newValuesSaved) // newly activated tab
    {
        newValuesSaved = false;
        initValues();
        displayTimer();
    }
    //e.relatedTarget // previous active tab
})

function playSound() {
	audio.src = 'sound_effect.mp3';
    audio.play();
	//audio.src = '';
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}