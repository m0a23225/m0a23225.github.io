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

    fetch("https://script.google.com/a/macros/edu.teu.ac.jp/s/AKfycbwOQUdTm3o2CgmYjLP9xQEzqxQcPZT3avwh6fnfbInnydIP-iADGV30-OcKa_7tH3FF/exec", 
        {
            method: "POST",
            body: JSON.stringify(data)
        });
});
