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
            <label>Resistencia de Base RB</label>
            <input type="number" id="rb" >kΩ
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
            <label>Factor n (0 - 10)</label>
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
            <option value="value2" selected>Base IBQ</option>
            <option value="value2">Colector ICQ</option>
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
  const RB = parseFloat(d.getElementById("rb").value);
  const RC = parseFloat(d.getElementById("rc").value);
  const RE = parseFloat(d.getElementById("re").value);
  const BETA = parseFloat(d.getElementById("beta").value);

  const inputs = [VCC, RB, RC, RE, BETA];

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

  let ibq = (VCC - 0.7) / (RE * (BETA + 1) + RB);
  let icq = BETA * ibq;
  let vceq = VCC - (RC + RE * ((BETA + 1) / BETA)) * icq;

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
  const N = parseFloat(d.getElementById("n").value);
  const VCC = parseFloat(d.getElementById("vcc").value);
  const IBQ = parseFloat(d.getElementById("ibq").value);
  const VCEQ = parseFloat(d.getElementById("vceq").value);
  const BETA = parseFloat(d.getElementById("beta").value);

  const inputs = [N, VCC, IBQ, VCEQ, BETA];

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

  let re = (VCC - VCEQ) / (IBQ * (N + (BETA + 1) / BETA));
  let rc = N * re;
  let rb = (BETA * (VCC - 0.7)) / IBQ - (BETA + 1) * re;

  rb = rb.toFixed(3);
  rc = rc.toFixed(3);
  re = re.toFixed(3);
  resultadosResistencias(rb, rc, re);
};

// Resultados Opcion 2
const resultadosResistencias = (rb, rc, re) => {
  const resultados = d.getElementById("resultados");
  resultados.innerHTML = `
  <h3>Resultados: </h3>
  <p>Resistencia de Base RB: <b>${rb} kΩ</b></p>
  <p>Resistencia de Colector RC: <b>${rc} kΩ</b></p>
  <p>Resistencia de Emisor RE: <b>${re} kΩ</b></p>
  `;
};
