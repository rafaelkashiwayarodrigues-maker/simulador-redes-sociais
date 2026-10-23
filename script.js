// Parâmetros didáticos informados no enunciado da atividade.
const dadosPesquisa = {
  mediaNacionalDiaria: 4,
  alertaSaude: 6,
  sugestoes: [
    {
      limite: 2,
      mensagem: "Parabéns! Seu uso está equilibrado. Você tem mais tempo livre para hobbies e descanso."
    },
    {
      limite: 5,
      mensagem: "Atenção. Você está na média nacional, mas já gasta quase um dia inteiro da sua semana olhando para a tela."
    },
    {
      limite: 24,
      mensagem: "Cuidado! Seu uso é considerado muito alto. Isso pode afetar seu sono, foco e saúde mental. Que tal um detox digital?"
    }
  ]
};

const formulario = document.getElementById("formulario");
const campoHoras = document.getElementById("horasDiarias");
const resultado = document.getElementById("resultado");
const erroInput = document.getElementById("erroInput");
const botaoLimpar = document.getElementById("limpar");

// Mostra os mesmos valores da base de dados na área de referências do site.
document.getElementById("mediaValor").textContent = `${dadosPesquisa.mediaNacionalDiaria}h`;
document.getElementById("alertaValor").textContent = `${dadosPesquisa.alertaSaude}h`;

function formatarNumero(valor) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(valor);
}

function buscarSugestao(horas) {
  return dadosPesquisa.sugestoes.find((sugestao) => horas <= sugestao.limite);
}

function compararComMedia(horas) {
  const diferenca = Math.abs(horas - dadosPesquisa.mediaNacionalDiaria);
  const unidade = diferenca === 1 ? "hora" : "horas";

  if (horas > dadosPesquisa.mediaNacionalDiaria) {
    return `Você passa ${formatarNumero(diferenca)} ${unidade} a mais por dia do que a média de referência de ${dadosPesquisa.mediaNacionalDiaria} horas.`;
  }

  if (horas < dadosPesquisa.mediaNacionalDiaria) {
    return `Você passa ${formatarNumero(diferenca)} ${unidade} a menos por dia do que a média de referência de ${dadosPesquisa.mediaNacionalDiaria} horas.`;
  }

  return `Seu tempo diário é igual à média de referência de ${dadosPesquisa.mediaNacionalDiaria} horas.`;
}

function mostrarErro(mensagem) {
  erroInput.textContent = mensagem;
  erroInput.hidden = false;
  campoHoras.setAttribute("aria-invalid", "true");
  campoHoras.focus();
}

function limparErro() {
  erroInput.textContent = "";
  erroInput.hidden = true;
  campoHoras.removeAttribute("aria-invalid");
}

function calcularTempo(evento) {
  evento.preventDefault();
  limparErro();

  const valorDigitado = campoHoras.value.trim().replace(",", ".");

  if (valorDigitado === "") {
    mostrarErro("Digite quantas horas por dia você passa nas redes sociais.");
    return;
  }

  const horasDiarias = Number(valorDigitado);

  if (!Number.isFinite(horasDiarias) || horasDiarias < 0 || horasDiarias > 24) {
    mostrarErro("Informe um número entre 0 e 24 horas.");
    return;
  }

  const horasSemana = horasDiarias * 7;
  const horasMes = horasDiarias * 30;
  const sugestao = buscarSugestao(horasDiarias);
  const comparacao = compararComMedia(horasDiarias);
  const atingiuAlerta = horasDiarias >= dadosPesquisa.alertaSaude;

  let classeStatus = "";
  let textoStatus = "Uso equilibrado";

  if (horasDiarias > 5) {
    classeStatus = "is-alert";
    textoStatus = "Uso muito alto";
  } else if (horasDiarias > 2) {
    classeStatus = "is-warning";
    textoStatus = "Vale observar";
  }

  const textoAlerta = atingiuAlerta
    ? `Seu tempo atingiu ou ultrapassou a referência de alerta de ${dadosPesquisa.alertaSaude} horas por dia.`
    : `Seu valor está abaixo do alerta diário de ${dadosPesquisa.alertaSaude} horas informado na atividade.`;

  resultado.innerHTML = `
    <div class="result-content">
      <div class="result-copy">
        <p class="result-kicker">Sua estimativa</p>
        <h3>${formatarNumero(horasDiarias)} ${horasDiarias === 1 ? "hora" : "horas"} por dia nas redes</h3>
        <p>${comparacao} ${textoAlerta}</p>
      </div>
      <span class="result-badge ${classeStatus}">${textoStatus}</span>
    </div>
    <div class="result-metrics">
      <div class="metric"><span>Em uma semana (× 7)</span><strong>${formatarNumero(horasSemana)} horas</strong></div>
      <div class="metric"><span>Em 30 dias (× 30)</span><strong>${formatarNumero(horasMes)} horas</strong></div>
    </div>
    <p class="reflection">${sugestao.mensagem}</p>
  `;
}

function reiniciarSimulador() {
  formulario.reset();
  limparErro();
  resultado.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon" aria-hidden="true">↗</span>
      <div>
        <strong>Seu resultado aparecerá aqui</strong>
        <p>Digite suas horas diárias e toque em calcular para ver a estimativa.</p>
      </div>
    </div>
  `;
  campoHoras.focus();
}

formulario.addEventListener("submit", calcularTempo);
botaoLimpar.addEventListener("click", reiniciarSimulador);
campoHoras.addEventListener("input", limparErro);
