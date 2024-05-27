function loadRequests() {
    fetch('http://127.0.0.1:3000/requests')
        .then(response => response.json())
        .then(data => {
            const openRequestsContainer = document.getElementById('requests-container');
            openRequestsContainer.innerHTML = '';

            const completedRequestsContainer = document.getElementById('completed-requests-container');
            completedRequestsContainer.innerHTML = '';

            data.forEach(request => {
                const card = createCard(request);
                if (request.completed) {
                    completedRequestsContainer.appendChild(card);
                } else {
                    openRequestsContainer.appendChild(card);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar pedidos:', error);
        });
}

function createCard(request) {
    const card = document.createElement('div');
    card.classList.add('card');
    if (request.completed) {
        card.classList.add('completed');
    } else {
        card.classList.add('open');
    }

    const title = document.createElement('h3');
    title.textContent = `Pedido de ${request.name}`;

    const sector = document.createElement('p');
    sector.textContent = `Setor: ${request.setor}`;

    const problem = document.createElement('p');
    problem.textContent = `Problema: ${request.problem}`;

    const timestamp = document.createElement('p');
    if (request.completed) {
        timestamp.textContent = `Finalizado em: ${new Date(request.completedTime).toLocaleString()}`;
    }

    card.appendChild(title);
    card.appendChild(sector);
    card.appendChild(problem);
    if (request.completed) {
        card.appendChild(timestamp);
    }

    if (!request.completed) {
        const finishButton = document.createElement('button');
        finishButton.textContent = 'Finalizar Serviço';
        finishButton.addEventListener('click', () => markAsComplete(request._id));
        card.appendChild(finishButton);
    } else {
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => editRequest(request._id, request.name, request.setor, request.problem));
        card.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.addEventListener('click', () => deleteRequest(request._id));
        card.appendChild(deleteButton);
    }

    return card;
}

function markAsComplete(requestId) {
    const completedTime = new Date().toISOString();

    fetch(`http://127.0.0.1:3000/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true, completedTime }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Pedido finalizado:', data);
        loadRequests();
    })
    .catch(error => {
        console.error('Erro ao finalizar o pedido:', error);
        alert(`Erro ao finalizar o pedido: ${error.message}`);
    });
}

function editRequest(requestId, name, setor, problem) {
    const newName = prompt("Editar Nome:", name);
    const newSetor = prompt("Editar Setor:", setor);
    const newProblem = prompt("Editar Problema:", problem);

    if (newName && newSetor && newProblem) {
        fetch(`http://127.0.0.1:3000/requests/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName, setor: newSetor, problem: newProblem }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Pedido editado:', data);
            loadRequests();
        })
        .catch(error => {
            console.error('Erro ao editar o pedido:', error);
            alert(`Erro ao editar o pedido: ${error.message}`);
        });
    }
}

function deleteRequest(requestId) {
    fetch(`http://127.0.0.1:3000/requests/${requestId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Pedido deletado:', data);
        loadRequests();
    })
    .catch(error => {
        console.error('Erro ao deletar o pedido:', error);
        alert(`Erro ao deletar o pedido: ${error.message}`);
    });
}

window.addEventListener('load', loadRequests);