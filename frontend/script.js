const askBtn = document.getElementById("askBtn");

askBtn.addEventListener("click", async () => {

    const question = document.getElementById("question").value;

    const answer = document.getElementById("answer");

    answer.innerHTML = "⏳ Thinking...";

    try {

        const response = await fetch("http://localhost:5000/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question
            })

        });

        const data = await response.json();

        answer.innerHTML = data.answer;

    } catch (err) {

        answer.innerHTML = "❌ Server Error";

        console.log(err);

    }

});