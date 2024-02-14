const divInputInsumos = document.querySelector("#input-insumos");
const addAnotherElementBtn = document.querySelector("#addAnotherElementBtn");
const totalInput = document.querySelector("#input--total");

// Função para evitar o comportamento padrão de envio do formulário ao pressionar "Enter"
function handleEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
}

// Função para calcular o custo
function calcularCusto() {
    // Obtém os valores dos campos de quantidade e preço
    let quantidade = parseFloat(
        this.parentElement.querySelector("[name='qtd']").value
    );
    let precoUnitario = parseFloat(
        this.parentElement.querySelector("[name='preco']").value
    );
    let custoInput = this.parentElement.querySelector("[name='custo']");

    // Verifica se ambos os campos têm valores válidos
    if (!isNaN(quantidade) && !isNaN(precoUnitario)) {
        // Calcula o custo e exibe no campo de custo
        let resultadoCalculo = (precoUnitario * quantidade).toFixed(2);
        custoInput.value = resultadoCalculo;

        // Chama a função para atualizar o total
        atualizarTotal();
    } else {
        // Se algum dos campos estiver vazio ou não for um número válido, limpa o campo de custo
        custoInput.value = "";
    }
}

// Função para atualizar o total
function atualizarTotal() {
    let total = 0;
    // Itera sobre todos os inputs de custo
    divInputInsumos.querySelectorAll("[name='custo']").forEach((custoInput) => {
        if (custoInput.value !== "") {
            total += parseFloat(custoInput.value);
        }
    });

    // Atualiza o campo de total
    totalInput.textContent = `Total: R$ ${total.toFixed(2)} para 1 receita`;
}

// Evento para adicionar um novo input
addAnotherElementBtn.addEventListener("click", () => {
    // Criação do container div para os inputs e botão de exclusão
    let novoInsumoDiv = document.createElement("div");

    // Adiciona os inputs de Nome, Quantidade, Preço da unidade total e Custo
    let nomeInput = criarInput("text", "nome", "Nome");
    let quantidadeInput = criarInput("number", "qtd", "Quantidade usada", 0);
    let precoInput = criarInput("number", "preco", "Preço da unidade total", 0);
    let custoInput = criarInput("text", "custo", "Custo", 0, true);

    custoInput.classList.add("input--disabled");

    nomeInput.addEventListener("keypress", handleEnterKey);
    quantidadeInput.addEventListener("keypress", handleEnterKey);
    precoInput.addEventListener("keypress", handleEnterKey);
    custoInput.addEventListener("keypress", handleEnterKey);

    // Adiciona os eventos de escuta para cálculo automático do custo
    quantidadeInput.addEventListener("input", calcularCusto);
    precoInput.addEventListener("input", calcularCusto);

    // Adiciona o botão de exclusão
    let deleteButton = criarBotaoDelete();
    deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        // Remove o insumo quando o botão de exclusão é clicado
        divInputInsumos.removeChild(novoInsumoDiv);
        // Atualiza o total após a remoção
        atualizarTotal();
    });

    // Adiciona os elementos criados ao container div
    novoInsumoDiv.appendChild(nomeInput);
    novoInsumoDiv.appendChild(quantidadeInput);
    novoInsumoDiv.appendChild(precoInput);
    novoInsumoDiv.appendChild(custoInput);
    novoInsumoDiv.appendChild(deleteButton);

    // Adiciona o container div ao divInputInsumos
    divInputInsumos.appendChild(novoInsumoDiv);
});

// Função para criar inputs
function criarInput(type, name, placeholder, min = null, disabled = false) {
    let input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.classList.add("input");
    if (min !== null) {
        input.min = min;
    }
    if (disabled) {
        input.disabled = true;
    }
    return input;
}

// Função para criar botão de exclusão
function criarBotaoDelete() {
    let deleteButton = document.createElement("button");
    deleteButton.className = "input--delete-button";
    deleteButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
    return deleteButton;
}
