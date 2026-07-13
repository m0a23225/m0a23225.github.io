// 回答者IDを取得（なければ新しく作る）
let userId = localStorage.getItem("userId");

if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
}

console.log(userId);

// 並び替え機能を追加
const list = document.getElementById("list");

new Sortable(list, {
    animation: 150
});

// ボタンが押されたら現在の順番を表示
document.getElementById("button").addEventListener("click", () => {

    const order = [...document.querySelectorAll("#list li")]
        .map(item => item.textContent);

    alert(order.join("\n"));

    console.log(order);

    fetch("https://script.google.com/macros/s/AKfycbwOQUdTm3o2CgmYjLP9xQEzqxQcPZT3avwh6fnfbInnydIP-iADGV30-OcKa_7tH3FF/exec", 
        {
            method: "POST",
            body: JSON.stringify({
                userId:"001",
                questionId:1,
                order:order
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
