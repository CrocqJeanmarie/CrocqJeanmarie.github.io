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
 * GitHub Pages → Cloudflare Worker → Brevo
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


        // Validation côté navigateur

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


        // Désactiver le bouton pendant l'envoi

        const submitButton =
            form.querySelector("button[type='submit']");


        if (submitButton) {

            submitButton.disabled = true;
            submitButton.textContent = "Envoi en cours...";

        }


        // Données envoyées à Cloudflare

        const data = {

            nom: nom,
            prenom: prenom,
            email: email,
            telephone: telephone,
            message: message,
            website: website

        };


        try {


            // Envoi vers le Worker Cloudflare

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


            // Lecture de la réponse

            const result =
                await response.json();


            // Cloudflare indique une erreur

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


            // SUCCÈS

            if (successMessage) {

                successMessage.textContent =
                    result.message ||
                    "Votre message a bien été envoyé.";

                successMessage.style.display = "block";

            }


            // Vider le formulaire

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


            // Réactiver le bouton

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

    /*
     * Création des points
     */

    slides.forEach((slide, index) => {

        const dot = document.createElement("span");

        dot.classList.add("dot");

        dot.addEventListener("click", () => {
            showSlide(index);
        });

        dotsContainer.appendChild(dot);

    });


    /*
     * Affichage d'une image
     */

    function showSlide(index) {

        // Retour à la dernière image
        if (index < 0) {
            currentIndex = slides.length - 1;
        }

        // Retour à la première image
        else if (index >= slides.length) {
            currentIndex = 0;
        }

        else {
            currentIndex = index;
        }


        /*
         * Déplacement du carrousel
         */

        const position =
            currentIndex * slidesContainer.clientWidth;

        slidesContainer.scrollTo({
            left: position,
            behavior: "smooth"
        });


        /*
         * Mise à jour des points
         */

        const dots =
            dotsContainer.querySelectorAll(".dot");

        dots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        });

    }


    /*
     * Bouton précédent
     */

    prevBtn.addEventListener("click", () => {

        showSlide(currentIndex - 1);

    });


    /*
     * Bouton suivant
     */

    nextBtn.addEventListener("click", () => {

        showSlide(currentIndex + 1);

    });


    /*
     * Flèches du clavier
     */

    document.addEventListener("keydown", (e) => {

        if (e.key === "ArrowRight") {

            showSlide(currentIndex + 1);

        }

        if (e.key === "ArrowLeft") {

            showSlide(currentIndex - 1);

        }

    });


    /*
     * Première image
     */

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


        /*
         * Afficher l'image
         */

        function updateImage() {

            img.src =
                slides[currentIndex]
                    .querySelector("img")
                    .src;

        }


        /*
         * Image précédente
         */

        prev.addEventListener("click", () => {

            currentIndex--;

            if (currentIndex < 0) {
                currentIndex = slides.length - 1;
            }

            updateImage();

        });


        /*
         * Image suivante
         */

        next.addEventListener("click", () => {

            currentIndex++;

            if (currentIndex >= slides.length) {
                currentIndex = 0;
            }

            updateImage();

        });


        /*
         * Fermer
         */

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


    /*
     * Cliquer sur une image
     */

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

