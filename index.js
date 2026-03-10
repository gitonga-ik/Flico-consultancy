document.addEventListener("DOMContentLoaded", () =>{
    const date = new Date();
    const year = date.getFullYear()

    const yearElement = document.getElementById("year")
    yearElement.textContent = `© ${year} Flico Consultancy`;
})