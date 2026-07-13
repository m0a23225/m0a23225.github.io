const sentences = [
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
];

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
