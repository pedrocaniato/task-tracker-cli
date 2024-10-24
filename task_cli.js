const fs = require('fs');

function addTask(description) {
    const tasksFile = 'tasks.json';
    
    // Ler o arquivo JSON, se não existir, criar um array vazio
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // O arquivo não existe, inicializar com um array vazio
                data = '[]';
            } else {
                console.error('Erro ao ler o arquivo:', err);
                return;
            }
        }

        // Converter os dados lidos de volta para um array de objetos
        const tasks = JSON.parse(data);
        
         // Criar um novo objeto de tarefa
         const newTask = {
            id: tasks.length + 1, // Atribuir um ID único
            description: description,
            status: 'to-do', // Estado inicial da tarefa
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Adicionar a nova tarefa ao array de tarefas
        tasks.push(newTask);

        // Escrever o array atualizado de volta no arquivo
        fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
            } else {
                console.log(`Tarefa adicionada com sucesso (ID: ${newTask.id})`);
            }
        });
    });
    const action = process.argv[2]; // Ação (add, update, delete)
const description = process.argv[3]; // Descrição da tarefa

if (action === 'add' && description) {
    addTask(description);
} else {
    console.log('Uso: node task_cli.js add "Descrição da Tarefa"');
}
}

function updateTask(id, newDescription) {
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }
        
        let tasks = JSON.parse(data);
        const task = tasks.find(task => task.id === id);
        
        if (!task) {
            console.log(`Tarefa com ID ${id} não encontrada.`);
            return;
        }
        
        task.description = newDescription;
        task.updatedAt = new Date().toISOString();

        fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), err => {
            if (err) {
                console.error('Erro ao salvar as tarefas:', err);
                return;
            }
            console.log(`Tarefa ${id} atualizada com sucesso!`);
        });
    });
}

// E, para capturar a ação e a descrição, você pode adicionar algo como:
if (action === 'update' && description) {
    const id = parseInt(process.argv[3]); // O ID da tarefa a ser atualizado
    updateTask(id, description);
} else {
    console.log('Uso: node task_cli.js update <ID> "Nova Descrição"');
}

function deleteTask(id) {
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }

        let tasks = JSON.parse(data);
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.id !== id); // Remove a tarefa com o ID fornecido

        if (tasks.length === initialLength) {
            console.log(`Tarefa com ID ${id} não encontrada.`);
            return;
        }

        fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), err => {
            if (err) {
                console.error('Erro ao salvar as tarefas:', err);
                return;
            }
            console.log(`Tarefa ${id} deletada com sucesso!`);
        });
    });
}

if (action === 'delete') {
    const id = parseInt(description); // Usando a descrição para o ID
    deleteTask(id);
} else {
    console.log('Uso: node task_cli.js delete <ID>');
}

function listTasks(status) {
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }

        let tasks = JSON.parse(data);
        
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (tasks.length === 0) {
            console.log('Nenhuma tarefa encontrada.');
            return;
        }

        tasks.forEach(task => {
            console.log(`ID: ${task.id}, Descrição: ${task.description}, Status: ${task.status}, Criado em: ${task.createdAt}`);
        });
    });
}

if (action === 'list') {
    const status = description; // `description` pode conter o status opcional
    listTasks(status);
} else {
    console.log('Uso: node task_cli.js list [status]');
    console.log('Status pode ser: todo, in-progress, done');
}