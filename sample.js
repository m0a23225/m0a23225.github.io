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

const shownOrder = [...document.querySelectorAll("#list li")]
    .map(item => item.textContent);

function shuffleList() {

    const list = document.getElementById("list");

    // li要素を配列にする
    const items = Array.from(list.children);

    // Fisher-Yatesアルゴリズム
    for (let i = items.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [items[i], items[j]] = [items[j], items[i]];
    }

    // 並び直す
    items.forEach(item => list.appendChild(item));

}

// 並び替え機能を追加
new Sortable(list, {
    animation: 150
});

// ボタンが押されたら現在の順番を表示
document.getElementById("button").addEventListener("click", () => {

    const elapsedTime = Date.now() - startTime;
    const order = [...document.querySelectorAll("#list li")]
        .map(item => item.textContent);

    alert(order.join("\n"));

    console.log(order);

    fetch("https://script.google.com/macros/s/AKfycbwOQUdTm3o2CgmYjLP9xQEzqxQcPZT3avwh6fnfbInnydIP-iADGV30-OcKa_7tH3FF/exec", 
        {
            method: "POST",
            body: JSON.stringify({
                userId:userId,
                questionId:1,
                shownOrder: shownOrder,
                order:order,
                elapsedTime: elapsedTime
            })
        })
    .then(response => response.json())
    .then(data => {
        alert("回答を記録しました");
    })
    .catch(error => {
        alert("送信に失敗しました");
        console.error(error);
    })
});
