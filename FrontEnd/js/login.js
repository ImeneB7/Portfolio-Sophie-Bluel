
document.addEventListener('DOMContentLoaded',() => {
    const loginLink = document.getElementById('login');
    const form = document.querySelector("form"); 

    form.addEventListener('submit',  (e) => {
        e.preventDefault();

        /*** VARIABLES ***/
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.querySelector(".error-message");

        console.log("email:", email);
        console.log("password:", password);

        /*** Envoi des données au serveur  à l'aide de la variable ***/
        let data = {
            email: email,
            password: password,
        };

        fetch('http://localhost:5678/api/users/login', {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json" 
            },
            body:  JSON.stringify(data)
    })
    .then((res) => res.json()) 
    .then((responseData) => {
        console.log("response data:", responseData);
        if (responseData.token){
            localStorage.setItem("token", responseData.token)
            window.location="index.html"
        } else {
            errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
            errorMessage.classList.add("error-message")
        }
    })
    .catch(error => {
        console.error('Erreur', error)
    })
})

})
