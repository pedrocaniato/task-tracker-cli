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
    
}
function updateTask(id, newDescription) {
    // Converte o id para um número, caso seja uma string
    const taskId = parseInt(id, 10);
    
    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }
        
        let tasks = JSON.parse(data);
        const task = tasks.find(task => task.id === taskId);
        
        if (!task) {
            console.log(`Tarefa com ID ${taskId} não encontrada.`);
            return;
        }
        
        task.description = newDescription;
        task.updatedAt = new Date().toISOString();
        fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), err => {
            if (err) {
                console.error('Erro ao salvar as tarefas:', err);
                return;
            }
            console.log(`Tarefa ${taskId} atualizada com sucesso!`);
        });
    });
}


function deleteTask(id) {
    const taskId = parseInt(id, 10);

    fs.readFile(tasksFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }
        let tasks = JSON.parse(data);
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.id !== taskId); // Remove a tarefa com o ID fornecido
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

const action = process.argv[2]; // Ação (add, update, delete)
let description // Descrição da tarefa
let id
switch(action){
    case 'add':
        description = process.argv[3]
        addTask(description)
        break
    case 'update':
        id = process.argv[3]
        description = process.argv[4]
        updateTask(id,description)
        break
    case 'list':
        const status = process.argv[3];
        listTasks(status)
        break
    case 'delete':
        id = process.argv[3]
        deleteTask(id)
        break
    default:
        console.log('Uso:');
        console.log('  node task_cli.js add "Descrição da Tarefa"');
        console.log('  node task_cli.js delete ID');
        console.log('  node task_cli.js update ID "Nova Descrição"');
        console.log('  node task_cli.js list "status" (opcional)');
}
