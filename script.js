document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
    const errorContainer = document.getElementById("error-message");
    
    const formContainer = document.getElementById("form-container");
    const summaryContainer = document.getElementById("summary-container");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
        errorContainer.textContent = ""; 

        // Récupération des valeurs
        const login = document.getElementById("login").value.trim();
        const nom = document.getElementById("nom").value.trim();
        const prenom = document.getElementById("prenom").value.trim();
        const adresse = document.getElementById("adresse").value.trim();
        const email = document.getElementById("email").value.trim();
        const telephone = document.getElementById("telephone").value.trim();
        const date_naissance = document.getElementById("date_naissance").value;
        const password = document.getElementById("password").value;
        const password_confirm = document.getElementById("password_confirm").value;

        // Validation : Champs vides
        if (!login || !nom || !prenom || !adresse || !email || !telephone || !date_naissance || !password || !password_confirm) {
            return showError("Veuillez remplir tous les champs obligatoires.");
        }

        // Validation : Format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return showError("Veuillez saisir une adresse email valide.");
        }

        // Validation : Correspondance des mots de passe
        if (password !== password_confirm) {
            return showError("Les mots de passe ne correspondent pas.");
        }

        // Si tout est valide, on injecte les données dans le récapitulatif
        document.getElementById("sum-login").textContent = login;
        document.getElementById("sum-nom").textContent = nom;
        document.getElementById("sum-prenom").textContent = prenom;
        document.getElementById("sum-adresse").textContent = adresse;
        document.getElementById("sum-email").textContent = email;
        document.getElementById("sum-telephone").textContent = telephone;
        document.getElementById("sum-date").textContent = date_naissance;

        // On masque le formulaire et on affiche le récapitulatif
        formContainer.classList.add("hidden");
        summaryContainer.classList.remove("hidden");
    });

    // Gestion du bouton "Recréer un nouveau compte"
    const btnRetour = document.getElementById("btn-retour");
    btnRetour.addEventListener("click", () => {
        form.reset(); 
        errorContainer.textContent = ""; 
        
        // Cache le récapitulatif et réaffiche le formulaire
        summaryContainer.classList.add("hidden");
        formContainer.classList.remove("hidden");
    });

    // Fonction utilitaire pour afficher les erreurs
    function showError(message) {
        errorContainer.textContent = message;
    }
});