var scale = new Array();
var left = new Array();
var right = new Array();
var def = new Array();
var NUM_SCALES = 6;

scale[0] = "Mental Demand";
left[0] = "Very Low";
right[0] = "Very High";
def[0] = "How mentally demanding was the task?";

scale[1] = "Physical Demand";
left[1] = "Very Low";
right[1] = "Very High";
def[1] = "How physically demanding was the task?";

scale[2] = "Temporal Demand";
left[2] = "Very Low";
right[2] = "Very High";
def[2] = "How hurried or rushed was the pace of the task?";

scale[3] = "Performance";
left[3] = "Perfect";
right[3] = "Failure";
def[3] = "How successful were you in accomplishing what you were asked to do?";

scale[4] = "Effort";
left[4] = "Very Low";
right[4] = "Very High";
def[4] = "How hard did you have to work to accomplish your level of performance?";

scale[5] = "Frustration";
left[5] = "Very Low";
right[5] = "Very High";
def[5] = "How insecure, discouraged, irritated, stressed, and annoyed were you?";

var pair = new Array();
pair[0] = "4 3";
pair[1] = "2 5";
pair[2] = "2 4";
pair[3] = "1 5";
pair[4] = "3 5";
pair[5] = "1 2";
pair[6] = "1 3";
pair[7] = "2 0";
pair[8] = "5 4";
pair[9] = "3 0";
pair[10] = "3 2";
pair[11] = "0 4";
pair[12] = "0 1";
pair[13] = "4 1";
pair[14] = "5 0";

var results_rating = new Array();
var results_tally = new Array();
var results_weight = new Array();
var results_overall;

var pair_num = 0;
for (var i = 0; i < NUM_SCALES; i++)
    results_tally[i] = 0;

function randOrd() {
    return (Math.round(Math.random()) - 0.5);
}

for (i = 0; i < 100; i++) {
    pair.sort(randOrd);
}

function scaleClick(index, val) {
    results_rating[index] = val;
    for (i = 5; i <= 100; i += 5) {
        var top = "t_" + index + "_" + i;
        var bottom = "b_" + index + "_" + i;
        document.getElementById(top).bgColor = '#FFFFFF';
        document.getElementById(bottom).bgColor = '#FFFFFF';
    }
    var top = "t_" + index + "_" + val;
    var bottom = "b_" + index + "_" + val;
    document.getElementById(top).bgColor = '#AAAAAA';
    document.getElementById(bottom).bgColor = '#AAAAAA';
}

function getScaleHTML(index) {
    var result = "";
    result += '<table><tr><td>';
    result += '<table class="scale">';
    result += '<tr><td colspan="20" class="heading">' + scale[index] + '</td></tr>';
    result += '<tr>';
    var num = 1;
    for (var i = 5; i <= 100; i += 5) {
        result += '<td id="t_' + index + '_' + i + '" class="top' + num + '" onMouseUp="scaleClick(' + index + ', ' + i + ');"></td>';
        num++;
        if (num > 2)
            num = 1;
    }
    result += '</tr>';
    result += '<tr>';
    for (var i = 5; i <= 100; i += 5) {
        result += '<td id="b_' + index + '_' + i + '" class="bottom" onMouseUp="scaleClick(' + index + ', ' + i + ');"></td>';
    }
    result += '</tr>';
    result += '<tr>';
    result += '<td colspan="10" class="left">' + left[index] + '</td><td colspan="10" class="right">' + right[index] + '</td>';
    result += '</tr></table></td>';
    result += '<td class="def">';
    result += def[index];
    result += '</td></tr></table>';
    return result;
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDateToCET(date) {
    const localDate = new Date(date.toLocaleString('en-US', {timeZone: 'Europe/Berlin'}));
    const year = localDate.getFullYear();
    const month = padTo2Digits(localDate.getMonth() + 1);
    const day = padTo2Digits(localDate.getDate());
    const hours = padTo2Digits(localDate.getHours());
    const minutes = padTo2Digits(localDate.getMinutes());
    const seconds = padTo2Digits(localDate.getSeconds());

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function onLoad() {
    document.body.style.zoom = "150%";
    for (var i = 0; i < NUM_SCALES; i++) {
        document.getElementById("scale" + i).innerHTML = getScaleHTML(i);
    }
    const params = new URLSearchParams(window.location.search);
    const sessionID = params.get("sessionID");

    if (sessionID)  document.getElementById("sessionID").value = sessionID;
}

function buttonPart1() {
    for (var i = 0; i < NUM_SCALES; i++) {
        if (!results_rating[i]) {
            alert('A value must be selected for every scale!');
            return false;
        }
    }
    document.getElementById('div_part1').style.display = 'none';
    document.getElementById('div_part4').style.display = '';
    calcResults();
    document.getElementById('div_part4').innerHTML = getResultsHTML();
    return true;
}

function buttonPart2() {
    document.getElementById('div_part2').style.display = 'none';
    document.getElementById('div_part3').style.display = '';
    setPairLabels();
    return true;
}

function setPairLabels() {
    var indexes = new Array();
    indexes = pair[pair_num].split(" ");
    var pair1 = scale[indexes[0]];
    var pair2 = scale[indexes[1]];
    document.getElementById('pair1').value = pair1;
    document.getElementById('pair2').value = pair2;
    document.getElementById('pair1_def').innerHTML = def[indexes[0]];
    document.getElementById('pair2_def').innerHTML = def[indexes[1]];
}

function buttonPair1() {
    var indexes = new Array();
    indexes = pair[pair_num].split(" ");
    results_tally[indexes[0]]++;
    nextPair();
    return true;
}

function buttonPair2() {
    var indexes = new Array();
    indexes = pair[pair_num].split(" ");
    results_tally[indexes[1]]++;
    nextPair();
    return true;
}

function calcResults() {
    results_overall = 0.0;
    for (var i = 0; i < NUM_SCALES; i++) {
        results_overall += results_rating[i] / 6;
    }
}

function getResultsCSV(user, session, timestamp) {
    var result = "Participant ID," + user + "\n";
    result += "Session No.," + session + "\n";
    result += "Timestamp," + timestamp + "\n";
    result += "Scale,Rating\n";
    for (var i = 0; i < NUM_SCALES; i++) {
        result += scale[i] + "," + results_rating[i] + "\n";
    }
    result += "Overall," + results_overall + "\n";
    return result;
}

function downloadCSV() {
    var user = document.getElementById('userID').value;
    var session = document.getElementById('sessionID').value;
    var timestamp = formatDateToCET(new Date());
    var csv = getResultsCSV(user, session, timestamp);
    var filename = user + "_" + session + "_" + timestamp + ".csv";
    var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    var link = document.createElement("a");
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function getResultsHTML() {
    var result = "";
    var user = document.getElementById('userID').value
    var session = document.getElementById('sessionID').value;
    var timestamp = formatDateToCET(new Date());
    result += "Participant ID: " + user + "<br/>";
    result += "Session No.: " + session + "<br/>";
    result += "Timestamp: " + timestamp + "<br/>";
    result += "<table><tr><td>Scale</td><td>Rating</td></tr>";
    for (var i = 0; i < NUM_SCALES; i++) {
        result += "<tr><td>" + scale[i] + "</td><td>" + results_rating[i] + "</td></tr>";
    }
    result += "</table>";
    result += "<br/>Overall: " + results_overall + "<br/>";
    result += '<button onclick="downloadCSV()" style="padding: 20px; font-size: 16px;">Download Results as CSV</button>';
    return result;
}

function nextPair() {
    pair_num++;
    if (pair_num >= 15) {
        document.getElementById('div_part3').style.display = 'none';
        document.getElementById('div_part4').style.display = '';
        calcResults();
        document.getElementById('div_part4').innerHTML = getResultsHTML();
    } else {
        setPairLabels();
    }
}