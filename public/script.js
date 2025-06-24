// public/script.js
// Shared outreach form logic

// Detect language on page load and set hidden field
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    // Prefer hl param, fallback to browser language
    const lang = (urlParams.get("hl") || navigator.language || navigator.userLanguage || "en").toLowerCase();
    const languageField = document.getElementById("language");
    if (lang.startsWith("es")) {
        languageField.value = "ES";
        const translations = {
            "title": "Alcance Comunitario de Avondale",
            "header": "¡Mantente conectado con tus vecinos!",
            "description": "Regístrate a continuación para recibir actualizaciones de grupos comunitarios locales que reúnen a los vecinos a través de noticias, eventos e intereses compartidos.",
            "newsletterSignups": "Inscripciones al Boletín Comunitario",
            "newsletterWals": "Boletín de West Avondale/Logan Square",
            "newsletterWalsDesc": "Noticias hiperlocales producidas por Larry Garret desde 1995. Cada dos meses.",
            "newsletterAna": "Asociación de Vecinos de Avondale",
            "newsletterAnaDesc": "Anuncios comunitarios y eventos en Avondale. Semanal.",
            "newsletterAga": "Alianza de Jardinería de Avondale",
            "newsletterAgaDesc": "Talleres y eventos gratuitos de jardinería enfocados en reunir a los vecinos. Cada dos meses.",
            "blockClubInterest": "Interés en Clubes de Bloque",
            "blockClubDesc": "Estoy interesado en formar un club de bloque con mis vecinos.",
            "blockClubYes": "Sí, por favor contáctenme para ayudar a organizar un club de bloque en mi calle.",
            "contactInfo": "Información de Contacto",
            "name": "Nombre",
            "email": "Correo Electrónico",
            "address": "Dirección (Opcional)",
            "submit": "Enviar",
            "successMessage": "¡Gracias por registrarte!",
            "successDesc": "Esté atento a los correos electrónicos de confirmación del boletín. Puede que pasen unos días antes de que se envíen.",
            "errorMessage": "Ocurrió un error. Por favor, inténtelo de nuevo.",
            "newsletterMlg": "Jardín de Vida Consciente",
            "newsletterMlgDesc": "Jardín comunitario junto al Parque Avondale con \"happy hours\" semanales gratuitas y jornadas de trabajo en el jardín dos veces por semana.",
            "newsletterAamg": "Jardín Mural de Avondale & Addison",
            "newsletterAamgDesc": "Jardín con murales y jornadas de trabajo en el jardín ocasionales. Cada pocos meses.",
            "newsletterKoz": "Consejo Asesor del Parque Koz",
            "newsletterKozDesc": "Eventos y oportunidades de voluntariado en el Parque Koz. Mensualmente.",
            "newsletterBrands": "Consejo Asesor del Parque Brands",
            "newsletterBrandsDesc": "Eventos y oportunidades de voluntariado en el Parque Brands.",
            "newsletterFcvl": "Amigos de la Escuela de Carl Von Linne",
            "newsletterFcvlDesc": "Apoya programas culturales, educativos y de enriquecimiento en Avondale y recauda fondos para la escuela primaria CVL para programas fuera del presupuesto escolar.",
            "shareButton": "Comparte con un vecino",
        };

        document.querySelectorAll("[data-translate]").forEach(element => {
            const key = element.getAttribute("data-translate");
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    } else {
        languageField.value = "EN";
    }

    // Language toggle button logic
    const langToggleBtn = document.getElementById("langToggleBtn");
    if (langToggleBtn) {
        const isSpanish = lang.startsWith("es");
        langToggleBtn.textContent = isSpanish ? "English" : "Español";
        langToggleBtn.onclick = function () {
            const params = new URLSearchParams(window.location.search);
            params.set("hl", isSpanish ? "en" : "es");
            window.location.search = params.toString();
        };
    }
});

document.getElementById("outreachForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;
    submitButton.innerHTML = 'Submitting... <span class="spinner"></span>';

    const errorMessage = document.getElementById("errorMessage");
    // hide error message (if visible)
    errorMessage.style.display = "none";

    // Get loc param if present (overrides FORM_VERSION)
    const urlParams = new URLSearchParams(window.location.search);
    const locParam = urlParams.get("loc");

    const data = {
        name: document.getElementById("name").value,
        address: document.getElementById("street-address").value,
        email: document.getElementById("email").value,
        newsletters: Array.from(document.querySelectorAll('input[name="newsletter"]:checked')).map(checkbox => checkbox.value).join(','),
        blockClubInterest: document.getElementById("block-club-interest").checked ? "Yes" : "No",
        formVersion: locParam || (typeof FORM_VERSION !== 'undefined' ? FORM_VERSION : "base"),
        language: document.getElementById("language").value
    };

    fetch("https://script.google.com/macros/s/AKfycbwkX8DkeBI_1AlNwXPDxc3cuED44Qyps3had4Py4z7eUblSUskrWBDtA7KyroCc2BrChw/exec", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "text/plain",
        }
    })
        .then(response => response.json())
        .then((response) => {
            if (response.status !== "Success") {
                throw new Error(`Failed to submit form data. ${response.message}`);
            }
            // Show success message
            document.getElementById("outreachForm").style.display = "none";
            document.getElementById("successMessage").style.display = "block";
            // Add share button logic
            const shareButton = document.getElementById("shareButton");
            if (shareButton) {
                shareButton.onclick = function () {
                    if (navigator.share) {
                        const lang = document.getElementById("language").value;
                        navigator.share({
                            title: document.title,
                            text: lang === "ES"
                                ? "¡Conéctate con tus vecinos y grupos comunitarios locales!"
                                : "Get connected with neighbors and local community groups!",
                            url: window.location.href
                        });
                    } else {
                        alert("Sharing is not supported on this device. You can copy the link: " + window.location.href);
                    }
                };
            }
        })
        .catch(error => {
            console.error("Error:", error);
            // re-enable form
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit';
            // show error message
            errorMessage.innerHTML = `Error: ${error.message}`;
            errorMessage.style.display = "block";
        });
});