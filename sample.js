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

});

fetch("https://script.google.com/u/0/home/projects/1Fpb27bUS-ZC0sklwW2JU_CDCHQ8XEpnESp32smMcdzVN-mSHeW11qo-T/edit", {
    method: "POST",
    body: JSON.stringify(data)
});
