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
        "短文1","短文2","短文3","短文4","短文5","短文6","短文7","短文8","短文9","短文10",
        "短文11","短文12","短文13","短文14","短文15","短文16","短文17","短文18","短文19","短文20"
    ],

    // 問題2
    [
        "短文21","短文22","短文23","短文24","短文25","短文26","短文27","短文28","短文29","短文30",
        "短文31","短文32","短文33","短文34","短文35","短文36","短文37","短文38","短文39","短文40"
    ],

    // 問題3
    [
        "短文41","短文42","短文43","短文44","短文45","短文46","短文47","短文48","短文49","短文50",
        "短文51","短文52","短文53","短文54","短文55","短文56","短文57","短文58","短文59","短文60"
    ],

    // 問題4
    [
        "短文61","短文62","短文63","短文64","短文65","短文66","短文67","短文68","短文69","短文70",
        "短文71","短文72","短文73","短文74","短文75","短文76","短文77","短文78","短文79","短文80"
    ],

    // 問題5
    [
        "短文81","短文82","短文83","短文84","短文85","短文86","短文87","短文88","短文89","短文90",
        "短文91","短文92","短文93","短文94","短文95","短文96","短文97","短文98","短文99","短文100"
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
// 「次の問題へ / 送信する」ボタン
// ==============================

nextQuestionButton.addEventListener("click", () => {

    // 現在の問題番号
    const questionNumber = currentQuestion + 1;

    // 現在の並び順を取得
    const order =
        [...document.querySelectorAll("#list li")]
        .map(item => item.textContent);

    // 現在の問題の回答時間
    const questionElapsedTime =
        Date.now() - questionStartTime;


    // ==============================
    // 確認画面
    // ==============================

    let confirmationText =
        "【問題" + questionNumber + "の確認】\n\n" +
        "以下の順番で回答を確定します。\n\n";

    confirmationText += order.join("\n");

    confirmationText +=
        "\n\nこの内容でよろしいですか？\n" +
        "OKを押すと回答を確定します。\n" +
        "キャンセルを押すと並び替えに戻ります。";


    const confirmed = confirm(confirmationText);


    // キャンセルされた場合
    if (!confirmed) {
        return;
    }


    // ==============================
    // 回答を保存
    // ==============================

    answers.push({
        questionId: questionNumber,
        order: order,
        elapsedTime: questionElapsedTime
    });


    console.log(
        "保存した問題:",
        questionNumber
    );

    console.log(
        "保存した並び順:",
        order
    );


    // ==============================
    // 問題5の場合
    // ==============================

    if (questionNumber === questions.length) {

        console.log("最後の問題です。送信します。");
        console.log("すべての回答:", answers);

        nextQuestionButton.disabled = true;
        nextQuestionButton.textContent = "送信中…";

        status.textContent = "送信中…";


        // ==========================
        // GASへ送信
        // ==========================

        const elapsedTime =
            Date.now() - startTime;


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

        .then(response => response.json())

        .then(data => {

            nextQuestionButton.textContent =
                "送信済み";

            status.textContent =
                "ご回答ありがとうございました。";

        })

        .catch(error => {

            console.error(error);

            nextQuestionButton.disabled = false;

            nextQuestionButton.textContent =
                "送信する";

            status.textContent =
                "送信に失敗しました。もう一度お試しください。";

        });


        // 問題6へ進まないために終了
        return;
    }


    // ==============================
    // 問題5ではない場合
    // → 次の問題へ
    // ==============================

    currentQuestion++;

    showQuestion(currentQuestion);

    // 画面を一番上まで戻す
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // ==============================
    // 問題5になったら
    // ボタンを「送信する」に変更
    // ==============================

    if (currentQuestion === questions.length - 1) {

        nextQuestionButton.textContent =
            "送信する";

    } else {

        nextQuestionButton.textContent =
            "次の問題へ";

    }

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
    
    // 画面を一番上まで戻す
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
