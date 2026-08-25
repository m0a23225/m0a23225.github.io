const sentences = [
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
    ],
    [
        "短文41",
        "短文42",
        "短文43",
        "短文44",
        "短文45",
        "短文46",
        "短文47",
        "短文48",
        "短文49",
        "短文50",
        "短文51",
        "短文52",
        "短文53",
        "短文54",
        "短文55",
        "短文56",
        "短文57",
        "短文58",
        "短文59",
        "短文60"
    ],
    [
        "短文61",
        "短文62",
        "短文63",
        "短文64",
        "短文65",
        "短文66",
        "短文67",
        "短文68",
        "短文69",
        "短文70",
        "短文71",
        "短文72",
        "短文73",
        "短文74",
        "短文75",
        "短文76",
        "短文77",
        "短文78",
        "短文79",
        "短文80"
    ],
    [
        "短文81",
        "短文82",
        "短文83",
        "短文84",
        "短文85",
        "短文86",
        "短文87",
        "短文88",
        "短文89",
        "短文90",
        "短文91",
        "短文92",
        "短文93",
        "短文94",
        "短文95",
        "短文96",
        "短文97",
        "短文98",
        "短文99",
        "短文100"
    ],
];

let age = "";
let gender = "";
let genre = "";
let frequency = "";

// ページを開いた時刻を記録
const startTime = Date.now();

// 送信ボタン関連
const button = document.getElementById("button");
const status = document.getElementById("status");

// 回答者IDを取得（なければ新しく作る）
let userId = localStorage.getItem("userId");

if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
}

console.log(userId);

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

const list = document.getElementById("list");

shuffle(sentences);

sentences.forEach(sentence => {

    const li = document.createElement("li");

    li.textContent = sentence;

    list.appendChild(li);

});

// 並び替え機能を追加
new Sortable(list, {
    animation: 150
});

// ボタンが押されたら現在の順番を表示
document.getElementById("button").addEventListener("click", () => {
    
    const elapsedTime = Date.now() - startTime;
    const order = [...document.querySelectorAll("#list li")]
        .map(item => item.textContent);
    
    console.log(order);
    
    const confirmed = confirm(
        "こちらは確認画面です。\n" +
        "まだ送信は完了していません！\n\n" +
        "【現在の並び順】\n" +
        order.join("\n")
    );
    
    if (!confirmed) {
        return;
    }
    
    button.disabled = true;
    status.textContent = "送信中…";

    fetch("https://script.google.com/macros/s/AKfycbwOQUdTm3o2CgmYjLP9xQEzqxQcPZT3avwh6fnfbInnydIP-iADGV30-OcKa_7tH3FF/exec", 
        {
            method: "POST",
            body: JSON.stringify({
                userId:userId,
                questionId:1,
                
                age: age,
                gender: gender,
                genre: genre,
                frequency: frequency,

                order:order,
                elapsedTime: elapsedTime
            })
        })
    .then(response => response.json())
    
    .then(data => {
        status.textContent = "ご回答ありがとうございました。";
        status.style.color = "#007BFF";
        button.textContent = "送信済み";
        button.disabled = true;
    })
    
    .catch(error => {
        status.textContent = "送信に失敗しました。もう一度お試しください。";
        status.style.color = "#28A745";
        button.disabled = false;
        console.error(error);
    })
});

document.getElementById("nextButton").addEventListener("click", () => {

    // 事前質問の回答を取得
    age = document.getElementById("age").value;
    gender = document.getElementById("gender").value;
    genre = document.getElementById("genre").value;
    frequency = document.getElementById("frequency").value;


    // 未回答項目を確認
    if (age === "") {
        alert("年齢を選択してください。");
        return;
    }

    if (gender === "") {
        alert("性別を選択してください。");
        return;
    }

    if (genre === "") {
        alert("普段読む文章のジャンルを選択してください。");
        return;
    }

    if (frequency === "") {
        alert("文章を読む頻度を選択してください。");
        return;
    }


    // 回答内容を確認
    console.log("年齢:", age);
    console.log("性別:", gender);
    console.log("文章ジャンル:", genre);
    console.log("読む頻度:", frequency);


    // すべて回答されていたら短文画面へ
    document.getElementById("profile-screen").style.display = "none";
    document.getElementById("survey-screen").style.display = "block";

});
