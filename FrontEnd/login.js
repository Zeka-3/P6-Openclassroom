const form = document.querySelector("#login-form")

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let adminInfo = {
        email: form.elements.email.value,
        password: form.elements.password.value
    }
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(adminInfo)
    })

    if (response.ok) {
        const data = await response.json();
        // enregistrement du Token dans le local storage afin de pouvoir s'en servir pour la suite du Projet
        sessionStorage.setItem('token', data.token);


        // Rediriger l'utilisateur sur la page d'accueil
        window.location.href = "index.html"
    } else {
        alert("email au mot pass incorecte")
    }
}
)
