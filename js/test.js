const subject = localStorage.getItem("subject");
const topic = localStorage.getItem("topic");

fetch(`data/${subject}.json`)
    .then(r => r.json())
    .then(data => {
        const test = data[topic];
        document.getElementById("title").innerText = test.title;

        let html = "";
        test.questions.forEach((q, i) => {
            html += `<p>${q.q}</p>`;
            q.a.forEach((v, j) => {
                html += `
                <label>
                    <input type="radio" name="q${i}" value="${j}">
                    ${v}
                </label><br>`;
            });
        });

        document.getElementById("test").innerHTML = html;
        window.correct = test.questions.map(q => q.correct);
    });

function check() {
    let score = 0;
    correct.forEach((c, i) => {
        const ans = document.querySelector(`input[name="q${i}"]:checked`);
        if (ans && +ans.value === c) score++;
    });
    alert(`Результат: ${score}/${correct.length}`);
}
