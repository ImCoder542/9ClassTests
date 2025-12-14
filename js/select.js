function go(page) {
    window.location.href = page;
}

function openTest(subject, topic) {
    localStorage.setItem("subject", subject);
    localStorage.setItem("topic", topic);
    window.location.href = "test.html";
}