const API_URL = "http://localhost:8080/api/predict";


const emailText = document.getElementById("emailText");

const checkBtn = document.getElementById("checkBtn");

const clearBtn = document.getElementById("clearBtn");

const charCount = document.getElementById("charCount");

const loading = document.getElementById("loading");

const result = document.getElementById("result");

const emptyState = document.getElementById("emptyState");



/* CHARACTER COUNTER */

emailText.addEventListener("input", () => {

    charCount.textContent =
        `${emailText.value.length} / 5000`;

});



/* EXAMPLE BUTTONS */

document
    .querySelectorAll("[data-example]")
    .forEach(button => {

        button.addEventListener("click", () => {

            if (button.dataset.example === "spam") {

                emailText.value =
                    "Congratulations! You have won a free cash prize. Claim your reward now by clicking this link. Limited time offer!";

            } else {

                emailText.value =
                    "Hey, are we meeting tomorrow for the project discussion? Please bring the report. See you at 10 AM.";

            }

            emailText.dispatchEvent(
                new Event("input")
            );

            emailText.focus();

        });

    });



/* CLEAR */

clearBtn.addEventListener("click", () => {

    emailText.value = "";

    emailText.dispatchEvent(
        new Event("input")
    );

    result.classList.add("hidden");

    emptyState.classList.remove("hidden");

});



/* ANALYZE */

checkBtn.addEventListener("click", async () => {

    const text =
        emailText.value.trim();


    if (!text) {

        emailText.focus();

        return;

    }


    loading.classList.remove("hidden");

    checkBtn.disabled = true;

    result.classList.add("hidden");

    emptyState.classList.add("hidden");


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    text: text

                })

            });


        if (!response.ok) {

            throw new Error(
                "Backend request failed"
            );

        }


        const data =
            await response.json();


        showResult(data);


    } catch (error) {

        console.error(error);

        emptyState.classList.remove(
            "hidden"
        );

        alert(
            "Backend is not reachable. Make sure Spring Boot is running on port 8080."
        );


    } finally {

        loading.classList.add("hidden");

        checkBtn.disabled = false;

    }

});



/* SHOW RESULT */

function showResult(data) {

    const spam =
        Number(data.spamProbability || 0) * 100;


    const ham =
        Number(data.hamProbability || 0) * 100;


    const confidence =
        Math.max(spam, ham);


    const isSpam =
        data.prediction === "SPAM";


    document.getElementById(
        "resultLabel"
    ).textContent =
        data.prediction;


    document.getElementById(
        "confidence"
    ).textContent =
        `${confidence.toFixed(1)}%`;


    document.getElementById(
        "resultMessage"
    ).textContent =
        data.message;


    document.getElementById(
        "spamProbability"
    ).textContent =
        `${spam.toFixed(1)}%`;


    document.getElementById(
        "hamProbability"
    ).textContent =
        `${ham.toFixed(1)}%`;


    document.getElementById(
        "spamBar"
    ).style.width =
        `${spam}%`;


    document.getElementById(
        "hamBar"
    ).style.width =
        `${ham}%`;


    const icon =
        document.getElementById(
            "verdictIcon"
        );


    if (isSpam) {

        icon.textContent = "!";

        icon.style.background =
            "#3b1725";

        icon.style.color =
            "#ff6d8e";

    } else {

        icon.textContent = "✓";

        icon.style.background =
            "#153a31";

        icon.style.color =
            "#36d99a";

    }


    result.classList.remove(
        "hidden"
    );


    /* RESULT ANIMATION */

    result.animate(

        [

            {
                opacity: 0,

                transform:
                    "translateY(10px)"

            },

            {
                opacity: 1,

                transform:
                    "translateY(0)"

            }

        ],

        {

            duration: 400,

            easing: "ease-out"

        }

    );

}