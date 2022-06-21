'use strict';

let timer1; //タイマーを格納する変数（タイマーID）の宣言
let timer2; //アラームのタイマーを格納する変数（タイマーID）の宣言
let alarmFlag = false;
let alarmCount = 3;
let messageText = "";

const xhr = new XMLHttpRequest();

//カウントダウン関数を1000ミリ秒毎に呼び出す関数
function cntStart() {
    document.getElementById("countStartButton").disabled = true;
    timer1 = setInterval("countDown()",1000);
    messageText = document.getElementById("messageTextInput").value;
}

//タイマー停止関数
function cntStop() {
    document.getElementById("countStartButton").disabled = false;
    clearInterval(timer1);
}

//カウントダウン関数
function countDown() {
    let min = document.getElementById("minutes").value;
    let sec = document.getElementById("seconds").value;

    if( (min === "") && (sec === "") )
    {
        alert("時刻を設定してください！");
        reSet();
    }
    else
    {
        if (min === "") {
            min = 0;
        }
        min = parseInt(min);

        if (sec === "") {
            sec = 0;
        }
        sec = parseInt(sec);

        tmWrite(min * 60 + sec - 1);
    }
}

//残り時間を書き出す関数
function tmWrite(int) {
    int = parseInt(int);

    if (int <= 0) {
        reSet();
        timer1 = setInterval("alarmCountDown()",1000);
        alarmFlag = true;
        document.getElementById("alarmStopButton").disabled = false;

    } else {
        //残り分数はintを60で割って切り捨てる
        document.getElementById("minutes").value = Math.floor(int/60);
        //残り秒数はintを60で割った余り
        document.getElementById("seconds").value = int % 60;
    }
}

function alarmStop() {
    alarmFlag = false;
    document.getElementById("alarmStopButton").disabled = true;
}

function alarmCountDown() {
    alarmCount --;
    document.getElementById("alarmCountDown").value = alarmCount;
    if (alarmCount < 1 && alarmFlag === true) {
        post();
        alarmFlag = false;
    }
}

function post() {
    const jsonAsocc = { "messageText" : messageText };
    const jsonText = JSON.stringify(jsonAsocc);
    xhr.open('POST', 'https://sample-app-2022-06-17.herokuapp.com/test', true);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(jsonText);
}

//フォームを初期状態に戻す（リセット）関数
function reSet() {
    document.getElementById("minutes").value = "0";
    document.getElementById("seconds").value = "0";
    document.getElementById("countStartButton").disabled = false;
    document.getElementById("alarmStopButton").disabled = false;
    clearInterval(timer1);
}
