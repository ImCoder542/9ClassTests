const subject = localStorage.getItem("subject");
const topic = localStorage.getItem("topic");

fetch(`data/${subject}.json`)
    .then(r => r.json())
    .then(data => {
        const test = data[topic];
        document.getElementById("title").innerText = test.title;

        let html = "";

        test.questions.forEach((q, i) => {
            html += `
            <div class="test-card question">
                <p>${q.q}</p>
            `;

            q.a.forEach((v, j) => {
                html += `
                <label class="answer">
                    <input type="radio" name="q${i}" value="${j}">
                    ${v}
                </label>
                `;
            });

            html += `</div>`;
        });

        document.getElementById("test").innerHTML = html;

        window.correct = test.questions.map(q => q.correct);
    });

function check() {
    let score = 0;
    let errorText = "";

    correct.forEach((right, i) => {
        const answers = document.querySelectorAll(`input[name="q${i}"]`);
        let chosen = -1;

        answers.forEach(a => {
            if (a.checked) chosen = +a.value;
        });

        answers.forEach((a, j) => {
            const label = a.parentElement;

            label.classList.remove("correct", "wrong");

            if (j === right) {
                label.classList.add("correct");
            }

            if (a.checked && j !== right) {
                label.classList.add("wrong");
            }
        });

        if (chosen === right) {
            score++;
        } else {
            const correctAnswer = test.questions[i].a[right];
            errorText += `<p>❌ Вопрос ${i + 1}: правильный ответ — <b>${correctAnswer}</b></p>`;
        }
    });

    document.getElementById("result").innerHTML = `
        <div class="result">
            Результат: ${score} / ${correct.length}
        </div>
        ${errorText ? `<div class="errors"><h3>Ошибки:</h3>${errorText}</div>` : ""}
    `;
}

