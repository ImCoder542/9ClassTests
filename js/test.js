const subject = localStorage.getItem("subject");
const topic = localStorage.getItem("topic");

let MODE = null;
let timeLeft = 45 * 60;
let timerInterval = null;


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

        document.querySelectorAll(".answer").forEach(label => {
            label.addEventListener("click", () => {
                const radio = label.querySelector("input[type='radio']");
                if (radio) {
                    radio.checked = true;
                }
            });
        });
    });

function check() {
    if (!MODE) {
        alert("Выберите режим!");
        return;
    }

    clearInterval(timerInterval);

    let right = 0;
    let errors = [];

    test.questions.forEach((q, i) => {
        const radios = document.querySelectorAll(`input[name="q${i}"]`);
        let chosen = null;

        radios.forEach(r => {
            if (r.checked) chosen = +r.value;
        });

        radios.forEach((r, j) => {
            const label = r.parentElement;

            if (MODE === "train") {
                label.classList.remove("correct", "wrong");
                if (j === q.correct) label.classList.add("correct");
                if (r.checked && j !== q.correct) label.classList.add("wrong");
            }

            r.disabled = true;
        });

        if (chosen === q.correct) right++;
        else errors.push({ n: i + 1, a: q.a[q.correct] });
    });

    const percent = Math.round((right / test.questions.length) * 100);
    const grade = percent >= 90 ? 5 :
                  percent >= 70 ? 4 :
                  percent >= 50 ? 3 : 2;

    renderResult(right, percent, grade, errors);
}

function renderResult(score, percent, grade, errors) {
    let html = `
        <div class="result">
            ✅ Правильных: <b>${score}</b><br>
            📊 Процент: <b>${percent}%</b><br>
            🏫 Оценка: <b>${grade}</b>
        </div>
    `;

    if (MODE === "train" && errors.length) {
        html += `<div class="errors"><h3>Ошибки:</h3>`;
        errors.forEach(e => {
            html += `<p>❌ Вопрос ${e.n}: <b>${e.a}</b></p>`;
        });
        html += `</div>`;
    }

    html += `<button onclick="restart()">🔁 Пройти заново</button>`;

    document.getElementById("result").innerHTML = html;
}

function setMode(mode) {
    MODE = mode;
    document.querySelector(".mode-select").style.display = "none";

    if (MODE === "exam") startTimer();
}

function startTimer() {
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Время вышло!");
            check();
        }
    }, 1000);
}

function updateTimer() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    document.getElementById("timer").innerText =
        `⏱ Осталось: ${min}:${sec.toString().padStart(2, '0')}`;
}

function restart() {
    location.reload();
}