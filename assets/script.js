document.getElementById('techForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let name = document.getElementById('name').value.trim();
    let setor = document.getElementById('setor').value.trim();
    let problem = document.getElementById('problem').value.trim();

    fetch('https://assistence-24c69f8f3217.herokuapp.com/submit-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, setor, problem }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('message').innerHTML = '<p>Solicitação enviada com sucesso! Em breve entrarei em contato.</p>';
        document.getElementById('techForm').reset();
    })
    .catch(error => {
        console.error('Erro ao enviar solicitação:', error);
        alert('Ocorreu um erro ao enviar a solicitação. Por favor, tente novamente mais tarde.');
    });
});
