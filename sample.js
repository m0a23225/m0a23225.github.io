// ==============================
// 事前質問の回答
// ==============================

let age = "";
let gender = "";
let genre = "";
let frequency = "";


// ==============================
// 問題データ
// ==============================

const questions = [

    // 問題1
    [
        "短文1",
        "短文2",
        "短文3",
        "短文4",
        "短文5",
        "短文6",
        "短文7",
        "短文8",
        "短文9",
        "短文10",
        "短文11",
        "短文12",
        "短文13",
        "短文14",
        "短文15",
        "短文16",
        "短文17",
        "短文18",
        "短文19",
        "短文20"
    ],

    // 問題2
    [
        "短文21",
        "短文22",
        "短文23",
        "短文24",
        "短文25",
        "短文26",
        "短文27",
        "短文28",
        "短文29",
        "短文30",
        "短文31",
        "短文32",
        "短文33",
        "短文34",
        "短文35",
        "短文36",
        "短文37",
        "短文38",
        "短文39",
        "短文40"
    ]

];


// ==============================
// 現在の問題番号
// ==============================

let currentQuestion = 0;


// ==============================
// 各問題の回答を保存
// ==============================

const answers = [];


// ==============================
// ページを開いた時刻
// ==============================

const startTime = Date.now();


// 問題ごとの開始時刻
let questionStartTime = Date.now();


// ==============================
// 回答者ID
// ==============================

let userId = localStorage.getItem("userId");

if (!userId) {

    userId = crypto.randomUUID();

    localStorage.setItem("userId", userId);

}

console.log("回答者ID:", userId);


// ==============================
// HTML要素
// ==============================

const list = document.getElementById("list");

const button = document.getElementById("button");

const status = document.getElementById("status");

const questionTitle = document.getElementById("questionTitle");

const nextQuestionButton =
    document.getElementById("nextQuestionButton");


// ==============================
// 配列をシャッフル
// ==============================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];

    }

    return array;

}


// ==============================
// 問題を表示する関数
// ==============================

function showQuestion(questionNumber) {

    // 現在の問題を取得
    const sentences =
        [...questions[questionNumber]];


    // ランダムに並べる
    shuffle(sentences);


    // 既存の短文を削除
    list.innerHTML = "";


    // 短文を表示
    sentences.forEach(sentence => {

        const li = document.createElement("li");

        li.textContent = sentence;

        list.appendChild(li);

    });


    // 問題番号を表示
    questionTitle.textContent =
        "問題" + (questionNumber + 1);


    // 問題開始時刻を記録
    questionStartTime = Date.now();

}


// ==============================
// SortableJS
// ==============================

new Sortable(list, {

    animation: 150

});


// ==============================
// 最初の問題を表示
// ==============================

showQuestion(0);


// ==============================
// 「次へ」ボタン
// ==============================

nextQuestionButton.addEventListener("click", () => {


    // 現在の並び順を取得
    const order =
        [...document.querySelectorAll("#list li")]
        .map(item => item.textContent);


    // この問題にかかった時間
    const questionElapsedTime =
        Date.now() - questionStartTime;


    // 回答を保存
    answers.push({

        questionId: currentQuestion + 1,

        order: order,

        elapsedTime: questionElapsedTime

    });


    console.log(
        "問題" + (currentQuestion + 1) + "の回答:",
        order
    );


    // 次の問題へ
    currentQuestion++;


    // まだ問題が残っている場合
    if (currentQuestion < questions.length) {


        showQuestion(currentQuestion);


        // 最後の問題ではないので「次の問題へ」
        nextQuestionButton.textContent =
            "次の問題へ";


    }


    // すべての問題が終了した場合
    else {


        // 次へボタンを非表示
        nextQuestionButton.style.display =
            "none";


        // 送信ボタンを表示
        button.style.display =
            "block";


        questionTitle.textContent =
            "すべての問題が終了しました";


        console.log(
            "すべての回答:",
            answers
        );

    }

});


// ==============================
// 「送信する」ボタン
// ==============================

button.addEventListener("click", () => {


    // アンケート全体の回答時間
    const elapsedTime =
        Date.now() - startTime;


    // 確認用の文章
    let confirmationText =
        "こちらは確認画面です。\n" +
        "まだ送信は完了していません！\n\n";


    answers.forEach(answer => {

        confirmationText +=
            "【問題" +
            answer.questionId +
            "】\n";

        confirmationText +=
            answer.order.join("\n");

        confirmationText += "\n\n";

    });


    // 確認画面
    const confirmed =
        confirm(confirmationText);


    // キャンセルされた場合
    if (!confirmed) {

        return;

    }


    // ボタンを無効化
    button.disabled = true;

    status.textContent =
        "送信中…";


    // Google Apps Scriptへ送信
    fetch(
        "https://script.google.com/macros/s/AKfycbwOQUdTm3o2CgmYjLP9xQEzqxQcPZT3avwh6fnfbInnydIP-iADGV30-OcKa_7tH3FF/exec",
        {

            method: "POST",

            body: JSON.stringify({

                userId: userId,

                questionId: "multiple",

                age: age,

                gender: gender,

                genre: genre,

                frequency: frequency,

                answers: answers,

                elapsedTime: elapsedTime

            })

        }
    )


    .then(response =>
        response.json()
    )


    .then(data => {

        status.textContent =
            "ご回答ありがとうございました。";

        button.textContent =
            "送信済み";

        button.disabled = true;

    })


    .catch(error => {

        status.textContent =
            "送信に失敗しました。もう一度お試しください。";

        button.disabled = false;

        console.error(error);

    });

});


// ==============================
// 「次へ」ボタン
// ==============================

document
.getElementById("nextButton")
.addEventListener("click", () => {


    // 事前質問の回答を取得

    age =
        document.getElementById("age").value;

    gender =
        document.getElementById("gender").value;

    genre =
        document.getElementById("genre").value;

    frequency =
        document.getElementById("frequency").value;


    // 未回答チェック

    if (age === "") {

        alert("年齢を選択してください。");

        return;

    }


    if (gender === "") {

        alert("性別を選択してください。");

        return;

    }


    if (genre === "") {

        alert(
            "普段読む文章のジャンルを選択してください。"
        );

        return;

    }


    if (frequency === "") {

        alert(
            "文章を読む頻度を選択してください。"
        );

        return;

    }


    // 回答内容を確認

    console.log("年齢:", age);

    console.log("性別:", gender);

    console.log("文章ジャンル:", genre);

    console.log("読む頻度:", frequency);


    // 事前質問画面を非表示

    document
    .getElementById("profile-screen")
    .style.display = "none";


    // 短文画面を表示

    document
    .getElementById("survey-screen")
    .style.display = "block";


});
