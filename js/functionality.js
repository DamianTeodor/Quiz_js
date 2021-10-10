const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 5;
const ALERT_THRESHOLD = 2;

$("#varianta1").click(function (e) {
    checkAnswer(e);
});
$("#varianta2").click(function (e) {
    checkAnswer(e);
});
$("#varianta3").click(function (e) {
    checkAnswer(e);
});
$("#varianta4").click(function (e) {
    checkAnswer(e);
});

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

let ticks = 9;
const TIME_LIMIT = 10;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

async function addTimer() {
    document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
    )}</span>
</div>
`;
}

async function onTimesUp() {
    if (ticks == 0) {
        clearInterval(timerInterval);
        //document.getElementById("base-timer-label").innerHTML = formatTime(-1);
    } else {
        timeLeft = TIME_LIMIT;
        timePassed = 0;
        await addTimer();
        clearInterval(timerInterval);
        startTimer();
        ticks--;
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
        setCircleDasharray();
        setRemainingPathColor(timeLeft);
        if (timeLeft === 0) {
            onTimesUp();
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `${seconds}`;
    }
    return `${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}


var question = [];
var correctAnswer = [];
var incorrectAnswers = [];
var index = 1;
var timer = 4;
var selected_correct_answer;
var selected_correct_answer_innerHTML;
var selected_wrong_answer;
var selected_wrong_answer_innerHTML;
var inutil;
var rand;
var correction_correct_answer;
var correction_wrong_answer;
for (var i = 0; i < 10; i++) {
    incorrectAnswers[i] = [];
}

function getQuestions() {
    let api = "https://opentdb.com/api.php?amount=10&type=multiple";
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            for (var i = 0; i < 10; i++) {
                question[i] = data.results[i].question;
                correctAnswer[i] = data.results[i].correct_answer;
                for (var j = 0; j < 3; j++) {
                    incorrectAnswers[i][j] = data.results[i].incorrect_answers[j];
                }
                console.log(question[i] + "\n" + correctAnswer[i] + "\n" + incorrectAnswers[i][0] + " " + incorrectAnswers[i][1] + " " + incorrectAnswers[i][2]);
            }
        })
}

function quiz_wait(callback) {
    $("#div_quiz").css("display", "flex");
    $("#div_waiter").html("Quiz-ul va incepe in " + 5 + " secunde");
    inutil = setInterval(() => {
        $("#div_waiter").html("Quiz-ul va incepe in " + timer + " secunde");
        timer--;
        if (timer == -1) {
            $("#div_waiter").html("");
            $("#div_waiter").hide();
            $("#div_quiz_content").show();
            clearInterval(inutil);
            callback(false);
        }
    }, 1000);
}

function start_game() {
    getQuestions();
    $("#div_start").hide();
    document.getElementsByTagName("body")[0].style.backgroundImage = "";
    quiz_wait(continue_execution);
}

async function reset_fields() {
    if (selected_correct_answer != undefined) {
        selected_correct_answer.firstElementChild.style.backgroundColor = "";
        selected_correct_answer.firstElementChild.innerHTML = selected_correct_answer_innerHTML;
        if (correction_correct_answer == undefined) {
            //console.log("correct is undefined");
            await new Promise(r => setTimeout(r, 20000));
        }
        selected_correct_answer.firstElementChild.firstElementChild.innerHTML = correction_correct_answer;
        selected_correct_answer.style.pointerEvents = "auto";
        //selected_correct_answer.firstElementChild.style.pointerEvents = "auto";
    }

    if (selected_wrong_answer != undefined) {
        selected_wrong_answer.firstElementChild.style.backgroundColor = "";
        selected_wrong_answer.firstElementChild.innerHTML = selected_wrong_answer_innerHTML;
        if (correction_wrong_answer == undefined) {
            //console.log("wrong is undefined");
            await new Promise(r => setTimeout(r, 20000));
        }
        selected_wrong_answer.firstElementChild.firstElementChild.innerHTML = correction_wrong_answer;
        selected_wrong_answer.style.pointerEvents = "auto";
        //selected_wrong_answer.firstElementChild.style.pointerEvents = "auto";
    }

    if (selected_correct_answer != undefined) {
        $("#varianta1").click(function (e) {
            checkAnswer(e);
        });
        $("#varianta2").click(function (e) {
            checkAnswer(e);
        });
        $("#varianta3").click(function (e) {
            checkAnswer(e);
        });
        $("#varianta4").click(function (e) {
            checkAnswer(e);
        });
    }

    selected_correct_answer = undefined;
    selected_correct_answer_innerHTML = undefined;
    selected_wrong_answer = undefined;
    selected_wrong_answer_innerHTML = undefined;
}

async function continue_execution(skip) {
    if (skip == false) {
        $("#p_intrebare").html(question[0]);
        rand = Math.floor(Math.random() * 4);
        document.getElementsByClassName("answers")[rand].innerHTML = correctAnswer[0];
        //console.log(incorrectAnswers[0]);
        var j = 0;
        for (var i = 0; i < 4; i++) {
            if (i != rand) {
                document.getElementsByClassName("answers")[i].innerHTML = incorrectAnswers[0][j];
                j++;
            }
        }
    } else {
        await new Promise(r => setTimeout(r, 3000));
        $("#p_intrebare").html(question[index]);
        console.log("index = " + index);
        rand = Math.floor(Math.random() * 4);
        document.getElementsByClassName("answers")[rand].innerHTML = correctAnswer[index];
        //console.log("raspunsuri incorecte inainte de for " + incorrectAnswers[index]);
        var j = 0;
        for (var i = 0; i < 4; i++) {
            if (i != rand) {
                if (selected_correct_answer != undefined && selected_correct_answer.firstElementChild == document.getElementsByClassName("answers")[i].parentNode) {
                    correction_correct_answer = incorrectAnswers[index][j];
                }
                else if (selected_wrong_answer != undefined && selected_wrong_answer.firstElementChild == document.getElementsByClassName("answers")[i].parentNode) {
                    correction_wrong_answer = incorrectAnswers[index][j];
                }
                else {
                    document.getElementsByClassName("answers")[i].innerHTML = incorrectAnswers[index][j];
                    //console.log("raspunsuri incorecte in if " + incorrectAnswers[index][j]);
                }
                j++;
            }
        }
        //await new Promise(r => setTimeout(r, 200000));
        index++;
        reset_fields();
    }

    addTimer();
    startTimer();

    inutil = setInterval(() => {
        if (index == 10) {
            clearInterval(inutil);
        }

        reset_fields();

        $("#p_intrebare").html(question[index]);
        console.log("index = " + index);
        for (var i = 0; i < 4; i++) {
            document.getElementsByClassName("answers")[i].innerHTML == "";
        }
        rand = Math.floor(Math.random() * 4);
        document.getElementsByClassName("answers")[rand].innerHTML = correctAnswer[index];
        var j = 0;
        //console.log(incorrectAnswers[index]);
        for (var i = 0; i < 4; i++) {
            if (i != rand) {
                document.getElementsByClassName("answers")[i].innerHTML = incorrectAnswers[index][j];
                j++;
            }
        }
        index++;
    }, 10000);
}

function checkAnswer(e) {
    var answer = e.target;
    switch (answer.tagName) {
        case "LABEL":
            answer = answer.parentNode;
            break;
        case "SPAN":
            answer = answer.parentNode.parentNode;
            break;
        default:
            break;
    }
    if (answer.innerHTML.includes(correctAnswer[10 - ticks - 1])) {
        answer.firstElementChild.style.backgroundColor = "white";
        selected_correct_answer_innerHTML = answer.firstElementChild.innerHTML;
        answer.firstElementChild.innerHTML = answer.firstElementChild.innerHTML + `<i style="pointer-events: none;"><img src="images/checkmark-24.png" class="verify_image"></i>`;
        answer.style.pointerEvents = "none";
        selected_correct_answer = answer;
        selected_wrong_answer_innerHTML = undefined;
        selected_wrong_answer = undefined;
    } else {
        console.log(correctAnswer[10 - ticks - 1]);
        for (var i = 0; i < 4; i++) {
            if (document.getElementsByClassName("answers")[i].innerHTML == correctAnswer[10 - ticks - 1]) {
                document.getElementsByClassName("answers")[i].parentNode.style.backgroundColor = "white";
                selected_correct_answer_innerHTML = document.getElementsByClassName("answers")[i].parentNode.innerHTML;
                document.getElementsByClassName("answers")[i].parentNode.innerHTML = document.getElementsByClassName("answers")[i].parentNode.innerHTML + `<i style="pointer-events: none;"><img src="images/checkmark-24.png" class="verify_image"></i>`;
                document.getElementsByClassName("answers")[i].parentNode.parentNode.style.pointerEvents = "none";
                selected_correct_answer = document.getElementsByClassName("answers")[i].parentNode.parentNode;
                break;
            }
        }
        answer.firstElementChild.style.backgroundColor = "white";
        selected_wrong_answer_innerHTML = answer.firstElementChild.innerHTML;
        answer.firstElementChild.innerHTML = answer.firstElementChild.innerHTML + `<i style="pointer-events: none;"><img src="images/x-mark-24.png" class="verify_image"></i>`;
        answer.style.pointerEvents = "none";
        selected_wrong_answer = answer;
    }
    $("#varianta1").unbind();
    $("#varianta2").unbind();
    $("#varianta3").unbind();
    $("#varianta4").unbind();

    clearInterval(inutil);
    clearInterval(timerInterval);
    ticks--;
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    continue_execution(true);
}