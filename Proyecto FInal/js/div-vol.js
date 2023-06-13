const d = document;
const opcionSeleccionada = d.getElementById("opcion-seleccionada");

d.addEventListener("click", (e) => {
  if (e.target.matches("#opcion1")) {
    opcionCorrientes();
  }

  if (e.target.matches("#opcion2")) {
    opcionResistencias();
  }

  if (e.target.matches("#calcularCorrientes")) {
    e.preventDefault();
    calcularCorrientes();
  }

  if (e.target.matches("#calcularResistencias")) {
    e.preventDefault();
    calcularResistencias();
  }
});

// Opciones del menú
const opcionCorrientes = () => {
  opcionSeleccionada.innerHTML = "";
  let formulario = `
    <form class="formulario">
        <div class="form-input">
            <label>Voltaje polarización VCC</label>
            <input type="number" id="vcc" >V
        </div>
        <div class="form-input">
            <label>Resistencia de Base RB1</label>
            <input type="number" id="rb1" >kΩ
        </div>
        <div class="form-input">
            <label>Resistencia de Base RB2</label>
            <input type="number" id="rb2" >kΩ
        </div>
        <div class="form-input">
            <label>Resistencia de Colector RC</label>
            <input type="number" id="rc" >kΩ
        </div>
        <div class="form-input">
            <label>Resistencia de emisor RE</label>
            <input type="number" id="re" >kΩ
        </div>
        <div class="form-input">
            <label>Ganancia de Corriente Beta</label>
            <input type="number" id="beta" >
        </div>

        <button id="calcularCorrientes">Calcular!</button>
    </form>
    <div id=resultados>
        <h3>Resultados: </h3>
    </div>
    `;
  opcionSeleccionada.innerHTML = formulario;
};

const opcionResistencias = () => {
  opcionSeleccionada.innerHTML = "";
  let formulario = `
    <form class="formulario">
        <div class="form-input">
            <label>Factor m (0 - 10)</label>
            <input type="number" id="m" >
        </div>
        <div class="form-input">
            <label>Factor n (0.01 - 0.1)</label>
            <input type="number" id="n" >
        </div>
        <div class="form-input">
            <label>Voltaje polarización VCC</label>
            <input type="number" id="vcc" >V
        </div>
        <div class="form-input">
        <div>
          <label>Corriente de </label>
          <select name="select">
            <option value="value2" >Base IBQ</option>
            <option value="value2" selected>Colector ICQ</option>
          </select>
        </div> 
            <input type="number" id="ibq" >mA
        </div>
        <div class="form-input">
            <label>Voltaje colector emisor VCEQ</label>
            <input type="number" id="vceq" >V
        </div>
        <div class="form-input">
            <label>Ganancia de Corriente Beta</label>
            <input type="number" id="beta" >
        </div>

        <button id="calcularResistencias">Calcular!</button>
    </form>
    <div id=resultados>
        <h3>Resultados: </h3>
    </div>
    `;
  opcionSeleccionada.innerHTML = formulario;
};

// Calculos Opcion 1
const calcularCorrientes = () => {
  const VCC = parseFloat(d.getElementById("vcc").value);
  const RB1 = parseFloat(d.getElementById("rb1").value);
  const RB2 = parseFloat(d.getElementById("rb2").value);
  const RC = parseFloat(d.getElementById("rc").value);
  const RE = parseFloat(d.getElementById("re").value);
  const BETA = parseFloat(d.getElementById("beta").value);

  const inputs = [VCC, RB1, RB2, RC, RE, BETA];

  // Validacion de los datos
  for (let input of inputs) {
    if (isNaN(input)) {
      const resultados = d.getElementById("resultados");
      resultados.innerHTML = `
      <h3>Resultados: </h3>
      <p>Por favor inserte valores válidos</p>
      `;
      return;
    }
  }

  //La fórmula la dividimos en 2 partes porque es muy larga
  let ibq = RB2 * VCC - (RB1 + RB2) * 0.7;

  ibq = ibq / (RE * (BETA + 1) * (RB1 + RB2) + RB1 * RB2);

  let icq = BETA * ibq;
  let vceq = VCC - icq * (RC + ((BETA + 1) * RE) / BETA);

  // para convertirlo en micro
  ibq = ibq * 1000;

  // Redondeamos un poco
  ibq = ibq.toFixed(3);
  icq = icq.toFixed(3);
  vceq = vceq.toFixed(3);
  resultadosCorrientes(ibq, icq, vceq);
};

// Resultados Opcion 1
const resultadosCorrientes = (ibq, icq, vceq) => {
  const resultados = d.getElementById("resultados");
  resultados.innerHTML = `
    <h3>Resultados: </h3>
    <p>Corriente de base IBQ: <b>${ibq} µA</b></p>
    <p>Corriente de colector ICQ: <b>${icq} mA</b></p>
    <p>Voltaje colector emisor VCEQ: <b>${vceq} V</b></p>
  
    `;
};

// Calculos Opcion 2
const calcularResistencias = () => {
  const M = parseFloat(d.getElementById("m").value);
  const N = parseFloat(d.getElementById("n").value);
  const VCC = parseFloat(d.getElementById("vcc").value);
  const IBQ = parseFloat(d.getElementById("ibq").value);
  const VCEQ = parseFloat(d.getElementById("vceq").value);
  const BETA = parseFloat(d.getElementById("beta").value);

  const inputs = [M, N, VCC, IBQ, VCEQ, BETA];

  // Validacion de los datos
  for (let input of inputs) {
    if (isNaN(input)) {
      const resultados = d.getElementById("resultados");
      resultados.innerHTML = `
        <h3>Resultados: </h3>
        <p>Por favor inserte valores válidos</p>
        `;
      return;
    }
  }

  let re = (1 / ((M + 1) * BETA + 1)) * ((VCC - VCEQ) / IBQ);
  let rc = M * re;
  let vth = ((1 + N) * BETA + 1) * (re * IBQ) + 0.7;
  let rb1 = (N * BETA * re * VCC) / vth;
  let rb2 = (N * BETA * re * VCC) / (VCC - vth);

  rb1 = rb1.toFixed(3);
  rb2 = rb2.toFixed(3);
  vth = vth.toFixed(3);
  rc = rc.toFixed(3);
  re = re.toFixed(3);
  resultadosResistencias(re, rc, vth, rb1, rb2);
};

// Resultados Opcion 2
const resultadosResistencias = (re, rc, vth, rb1, rb2) => {
  const resultados = d.getElementById("resultados");
  resultados.innerHTML = `
  <h3>Resultados: </h3>
  <p>Resistencia de Emisor RE: <b>${re} kΩ</b></p>
  <p>Resistencia de Colector RC: <b>${rc} kΩ</b></p>
  <p>Voltaje Thevenin VTH: <b>${vth} V</b></p>
  <p>Resistencia de Base RB1: <b>${rb1} kΩ</b></p>
  <p>Resistencia de Base RB2: <b>${rb2} kΩ</b></p>
  `;
};
