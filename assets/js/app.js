const divInputInsumos = document.querySelector("#input-insumos");
const addAnotherElementBtn = document.querySelector("#addAnotherElementBtn");
const totalInput = document.querySelector("#input--total");
const totalRecipePerUnit = document.querySelector("#total-recipe-per-unit");
const rendimento = document.querySelector("#Rendimento");
const salary = document.querySelector("#salario");
const hoursWorked = document.querySelector("#horas-trabalhadas");
const timeRecipe = document.querySelector("#tempo-receita");
const fixedCosts = document.querySelector("#fixa");
const variableCosts = document.querySelector("#variaveis");
const profit = document.querySelector("#input-lucro");
const shipping = document.querySelector("#frete");
const taxes = document.querySelector("#impostos");
const calculatePriceBtn = document.querySelector("#calculate-price");
let recipeTotal;
let laborOfTheRecipe;
let fixedVariable;
let profitValue;
let taxesValue;
let shippingValue;

const f = new Intl.NumberFormat(undefined, {
    currency: "BRL",
    style: "currency",
});

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
        let resultadoCalculo = precoUnitario * quantidade;
        custoInput.value = f.format(resultadoCalculo);

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
            let str = custoInput.value;
            let newNum = str.replace(/[^\d.]/g, "");
            newNum = newNum.replace(/\./g, "");
            total += newNum / 100;
            recipeTotal = total;
        }
    });

    // Atualiza o campo de total
    totalInput.textContent = `Total: ${f.format(total)} para uma receita`;

    // Atualizar o valor total da receita por unidade
    updateRecipeValuePerUnit();
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

// Função para calcular o Valor da receita por unidade
rendimento.addEventListener("input", updateRecipeValuePerUnit);
function updateRecipeValuePerUnit() {
    if (rendimento.value != "" && totalInput.innerText != "") {
        let insumo = totalInput.innerText.replace(/[^\d.]/g, "");
        insumo = insumo.replace(/\./g, "");
        insumo = insumo / 100;

        let reciperPerUnit = insumo / parseFloat(rendimento.value);

        totalRecipePerUnit.innerText = `${f.format(reciperPerUnit)}`;
    }
}

// Eventos de input da seção de mão de obra
salary.addEventListener("input", getLaborValues);
hoursWorked.addEventListener("input", getLaborValues);
timeRecipe.addEventListener("input", getLaborValues);

// Função que pega os valores da mão de obra
function getLaborValues() {
    let resultHoursWorked = 0;
    let resultTimeRecipe = 0;
    let resultSalary = 0;
    if (hoursWorked.value != "") {
        resultHoursWorked = parseFloat(hoursWorked.value);
    }
    if (timeRecipe.value != "") {
        let hoursMinutes = timeRecipe.value.split(/[.:]/);
        let hours = parseInt(hoursMinutes[0], 10);
        let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        resultTimeRecipe = hours + minutes / 60;
    }
    if (salary.value != "") {
        resultSalary = parseFloat(salary.value);
    }
    if (
        hoursWorked.value != "" &&
        timeRecipe.value != "" &&
        salary.value != ""
    ) {
        // enviando os valores pegados pra a função que calcula a mão de obra
        calculateLabor(resultHoursWorked, resultTimeRecipe, resultSalary);
    }
}

// Calculando o valor da mão de obra
function calculateLabor(hoursWorked, timeRecipe, salary) {
    let labor = salary / (hoursWorked * 5);
    laborOfTheRecipe = labor * timeRecipe;
}

fixedCosts.addEventListener("input", calculateFixedVariable);
variableCosts.addEventListener("input", calculateFixedVariable);

// Calcula os custos fixos e variaveis
function calculateFixedVariable() {
    let fixed = parseFloat(fixedCosts.value);
    let variable = parseFloat(variableCosts.value);

    let totalCosts = fixed + variable;

    if (hoursWorked.value != "" && !isNaN(fixed) && !isNaN(variable)) {
        fixedVariable = totalCosts / (parseFloat(hoursWorked.value) * 5);
    }
}

shipping.addEventListener("input", () => {
    shippingValue = parseFloat(shipping.value);
});
taxes.addEventListener("input", () => {
    taxesValue = parseFloat(taxes.value);
});
profit.addEventListener("input", () => {
    profitValue = parseFloat(profit.value);
});

calculatePriceBtn.addEventListener("click", calculatePrice);

function calculatePrice() {
    let units = rendimento.value;
    if (
        !isNaN(recipeTotal) &&
        !isNaN(laborOfTheRecipe) &&
        !isNaN(fixedVariable) &&
        !isNaN(profitValue) &&
        !isNaN(taxesValue) &&
        !isNaN(shippingValue) &&
        !isNaN(units) &&
        units != 0
    ) {
        console.log("entrou");
        let total = recipeTotal + laborOfTheRecipe + fixedVariable;
        total *= 1 + profitValue / 100;
        total /= units;
        total *= 1 + taxesValue / 100;
        total += shippingValue;
        console.log(total);
        let resultado = document.querySelector("#resultado");
        resultado.innerText = `O preço final do seu doce deverá ser de ${f.format(
            total
        )}`;
    }
}
