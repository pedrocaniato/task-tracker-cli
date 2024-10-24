const fs = require('fs');

const tasksFile = 'tasks.json';

function addTask(description) {
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

        // Converter os dados lidos de volta para um array de objetos, se não tiver nada, ele retorna un array vazio
        const tasks = data ? JSON.parse(data) : [];
        
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

// Captura os argumentos da linha de comando
const action = process.argv[2]; // Ação (add, update, delete, list)
const id = process.argv[3] ? Number(process.argv[3]) : undefined; // ID da tarefa

let description;
if (action === 'add') {
    // Para a ação 'add', a descrição estará no índice 3
    description = process.argv.slice(3).join(' '); // Junte todos os argumentos a partir do índice 3
} else {
    // Para as outras ações, a descrição estará no índice 4
    description = process.argv[4];
}

if (action === 'add' && description) {
    addTask(description);
} else if (action === 'delete' && id) {
    deleteTask(id);
} else if (action === 'update' && id && description) {
    updateTask(id, description);
} else if (action === 'list') {
    listTasks(description); // Usar description como status opcional
} else {
    console.log('Uso:');
    console.log('  node task_cli.js add "Descrição da Tarefa"');
    console.log('  node task_cli.js delete ID');
    console.log('  node task_cli.js update ID "Nova Descrição"');
    console.log('  node task_cli.js list "status" (opcional)');
}
