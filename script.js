/**************************************************
 * MENU MOBILE
 **************************************************/

const bouton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".Navigation");

if (bouton && menu) {

    bouton.addEventListener("click", () => {

        menu.classList.toggle("active");

    });

}


/**************************************************
 * FORMULAIRE DE CONTACT
 **************************************************/

const form = document.getElementById("contactForm");

const successMessage = document.getElementById("success-message");
const errorMessage = document.getElementById("error-message");

const CLOUDFLARE_WORKER_URL =
    "https://api-contact-site-parent.crocqjeanmarie56.workers.dev";


if (form) {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();


        // Cacher les anciens messages

        if (successMessage) {
            successMessage.style.display = "none";
        }

        if (errorMessage) {
            errorMessage.style.display = "none";
        }


        // Récupération des champs

        const nom =
            document.getElementById("nom").value.trim();

        const prenom =
            document.getElementById("prenom").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const telephone =
            document.getElementById("telephone").value.trim();

        const message =
            document.getElementById("message").value.trim();

        const website =
            document.getElementById("website").value.trim();


        const erreurs = [];


        if (!nom) {
            erreurs.push("Le nom est obligatoire.");
        }


        if (!prenom) {
            erreurs.push("Le prénom est obligatoire.");
        }


        if (!email) {
            erreurs.push("L'adresse email est obligatoire.");
        }


        if (!telephone) {
            erreurs.push("Le numéro de téléphone est obligatoire.");
        }


        if (!message) {
            erreurs.push("Le message est obligatoire.");
        }


        // Vérification email

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            email &&
            !emailPattern.test(email)
        ) {

            erreurs.push(
                "L'adresse email n'est pas valide."
            );

        }


        // Vérification téléphone

        const telephonePattern =
            /^[0-9 +().-]{8,20}$/;


        if (
            telephone &&
            !telephonePattern.test(telephone)
        ) {

            erreurs.push(
                "Le numéro de téléphone n'est pas valide."
            );

        }


        // Vérification longueur message

        if (message.length > 3000) {

            erreurs.push(
                "Le message est trop long (maximum 3000 caractères)."
            );

        }


        // Si erreurs

        if (erreurs.length > 0) {

            if (errorMessage) {

                errorMessage.innerHTML =
                    erreurs.join("<br>");

                errorMessage.style.display = "block";

            }

            return;

        }



        const submitButton =
            form.querySelector("button[type='submit']");


        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Envoi en cours...";

        }



        const data = {

            nom: nom,
            prenom: prenom,
            email: email,
            telephone: telephone,
            message: message,
            website: website

        };


        try {


            const response = await fetch(
                CLOUDFLARE_WORKER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)

                }
            );


            const result =
                await response.json();


            if (!response.ok || !result.success) {

                let messageErreur =
                    result.message ||
                    "Impossible d'envoyer le message actuellement.";


                if (
                    result.erreurs &&
                    Array.isArray(result.erreurs)
                ) {

                    messageErreur =
                        result.erreurs.join("<br>");

                }


                throw new Error(messageErreur);

            }


            if (successMessage) {

                successMessage.textContent =
                    result.message ||
                    "Votre message a bien été envoyé.";

                successMessage.style.display = "block";

            }



            form.reset();


        } catch (error) {


            console.error(
                "Erreur lors de l'envoi :",
                error
            );


            if (errorMessage) {

                errorMessage.innerHTML =
                    error.message ||
                    "Une erreur est survenue lors de l'envoi du message.";

                errorMessage.style.display = "block";

            }

        } finally {



            if (submitButton) {

                submitButton.disabled = false;
                submitButton.textContent = "Envoyer";

            }

        }

    });

}



/**************************************************
 * CARROUSEL
 **************************************************/

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const slidesContainer = document.querySelector(".carousel-inner");
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".carousel-dots");

let currentIndex = 0;


if (
    prevBtn &&
    nextBtn &&
    slidesContainer &&
    dotsContainer &&
    slides.length > 0
) {


    slides.forEach((slide, index) => {

        const dot = document.createElement("span");

        dot.classList.add("dot");

        dot.addEventListener("click", () => {
            showSlide(index);
        });

        dotsContainer.appendChild(dot);

    });



    function showSlide(index) {

        if (index < 0) {
            currentIndex = slides.length - 1;
        }

        else if (index >= slides.length) {
            currentIndex = 0;
        }

        else {
            currentIndex = index;
        }



        const position =
            currentIndex * slidesContainer.clientWidth;

        slidesContainer.scrollTo({
            left: position,
            behavior: "smooth"
        });



        const dots =
            dotsContainer.querySelectorAll(".dot");

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        });

    }



    prevBtn.addEventListener("click", () => {

        showSlide(currentIndex - 1);

    });



    nextBtn.addEventListener("click", () => {

        showSlide(currentIndex + 1);

    });


    document.addEventListener("keydown", (e) => {

        if (e.key === "ArrowRight") {

            showSlide(currentIndex + 1);

        }

        if (e.key === "ArrowLeft") {

            showSlide(currentIndex - 1);

        }

    });



    showSlide(0);


    /**************************************************
     * LIGHTBOX
     **************************************************/

    function openLightbox(index) {

        currentIndex = index;


        const overlay =
            document.createElement("div");

        overlay.className = "lightbox";


        const img =
            document.createElement("img");


        const prev =
            document.createElement("button");

        prev.className = "prev";
        prev.textContent = "←";


        const next =
            document.createElement("button");

        next.className = "next";
        next.textContent = "→";


        const close =
            document.createElement("span");

        close.className = "close";
        close.innerHTML = "&times;";



        function updateImage() {

            img.src =
                slides[currentIndex]
                    .querySelector("img")
                    .src;

        }




        prev.addEventListener("click", () => {

            currentIndex--;

            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            }

            updateImage();

        });



        next.addEventListener("click", () => {

            currentIndex++;

            if (currentIndex >= slides.length) {
                currentIndex = 0;
            }

            updateImage();

        });




        close.addEventListener("click", () => {

            overlay.remove();

        });


        updateImage();


        overlay.appendChild(prev);
        overlay.appendChild(img);
        overlay.appendChild(next);
        overlay.appendChild(close);


        document.body.appendChild(overlay);

    }


    slides.forEach((slide, index) => {

        const img =
            slide.querySelector("img");

        if (img) {

            img.addEventListener("click", () => {

                openLightbox(index);

            });

        }

    });

}

