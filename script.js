document.addEventListener('DOMContentLoaded', () => {
    // Seleção dos elementos do DOM
    const form = document.querySelector('form');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDateInput = document.querySelector('input[type="date"]');
    const btnCancel = document.getElementById('btnCancel');
    const btnLogout = document.getElementById('btnLogout');
    const section = document.querySelector('section');

    // Cria o elemento para exibir a lista de tarefas, caso não exista no HTML
    let taskList = document.getElementById('taskList');
    if (!taskList) {
        taskList = document.createElement('ul');
        taskList.id = 'taskList';
        taskList.style.listStyle = 'none';
        taskList.style.padding = '0';
        // Insere a lista antes da div form-group / footer
        section.insertBefore(taskList, document.querySelector('.form-group'));
    }

    // Carregar tarefas salvas no LocalStorage ao iniciar
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();

    // Evento de envio do formulário (Adicionar Tarefa)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        const date = taskDateInput.value;

        if (title === '' || date === '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        const newTask = {
            id: Date.now(),
            title: title,
            date: date,
            completed: false
        };

        tasks.push(newTask);
        saveAndRender();
        clearInputs();
    });

    // Evento para o botão Cancelar
    btnCancel.addEventListener('click', () => {
        clearInputs();
    });

    // Evento para o botão Sair
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Deseja realmente sair do sistema?')) {
            alert('Você saiu do sistema.');
            // Exemplo de redirecionamento para página de login:
            // window.location.href = 'login.html';
        }
    });

    // Função para limpar os campos de entrada
    function clearInputs() {
        taskTitleInput.value = '';
        taskDateInput.value = '';
    }

    // Função para salvar no LocalStorage e atualizar a tela
    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Função para renderizar/exibir as tarefas na página
    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="color: #666;">Nenhuma tarefa cadastrada.</p>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyElement = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '10px';
            li.style.padding = '10px';
            li.style.border = '1px solid #ccc';
            li.style.borderRadius = '5px';

            // Formatação da data para o padrão brasileiro (dd/mm/aaaa)
            const formattedDate = task.date.split('-').reverse().join('/');

            li.innerHTML = `
                <span style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                    <strong>${task.title}</strong> - Data: ${formattedDate}
                </span>
                <div>
                    <button onclick="toggleTask(${task.id})" style="margin-right: 5px; cursor: pointer;">
                        ${task.completed ? 'Desmarcar' : 'Concluir'}
                    </button>
                    <button onclick="deleteTask(${task.id})" style="color: red; cursor: pointer;">Excluir</button>
                </div>
            `;

            taskList.appendChild(li);
        });
    }

    // Funções globais para alterar estado e deletar
    window.toggleTask = function(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveAndRender();
    };

    window.deleteTask = function(id) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveAndRender();
        }
    };
});