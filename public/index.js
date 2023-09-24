const submitButton = document.querySelector('button[type="submit"]');
const fileInput = document.querySelector('input[name="file"]')
const isMaliciousInput = document.querySelector('input[name="isMalicious"]')

submitButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const file = fileInput.files[0];

    if (!file) return alert("Você não inseriu um arquivo.");


    const formData = new FormData();
    formData.append('isMalicious', isMaliciousInput.checked ? 'on' : 'off');
    formData.append('file', file);

    try {
        const options = {
            method: 'post',
            body: formData
        };
        const response = await fetch('http://localhost:3000/files', options);
        if (response.ok) return alert("Arquivo verificado com sucesso.");

        return alert("O servidor demorou demais para responder, tente novamente mais tarde.");
    } catch (error) {
        return alert(JSON.stringify(error));
    }
})