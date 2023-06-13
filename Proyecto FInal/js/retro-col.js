const d = document;
const opcionSeleccionada = d.getElementById("opcion-seleccionada");

// Detectar click de botones
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
            <label>Resistencia de retroalimentación RF</label>
            <input type="number" id="rf" >kΩ
        </div>
        <div class="form-input">
            <label>Resistencia de Colector RC</label>
            <input type="number" id="rc" >kΩ
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
            <label>Voltaje polarización VCC</label>
            <input type="number" id="vcc" >V
        </div>
        <div class="form-input">
        <div>
          <label>Corriente de </label>
          <select name="select">
            <option value="value2">Base IBQ</option>
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
  const RF = parseFloat(d.getElementById("rf").value);
  const RC = parseFloat(d.getElementById("rc").value);
  const BETA = parseFloat(d.getElementById("beta").value);

  const inputs = [VCC, RF, RC, BETA];

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

  let ibq = (VCC - 0.7) / (RC * (BETA + 1) + RF);
  let icq = BETA * ibq;
  let vceq = VCC - RC * (BETA + 1) * ibq;

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
  const VCC = parseFloat(d.getElementById("vcc").value);
  const IBQ = parseFloat(d.getElementById("ibq").value);
  const VCEQ = parseFloat(d.getElementById("vceq").value);
  const BETA = parseFloat(d.getElementById("beta").value);

  const inputs = [VCC, IBQ, VCEQ, BETA];

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

  // Ocupamos ponerla como lo requieren los calculos

  let rc = (VCC - VCEQ) / ((BETA + 1) * IBQ);
  let rf = (VCEQ - 0.7) / IBQ;

  rf = rf.toFixed(3);
  rc = rc.toFixed(3);
  resultadosResistencias(rf, rc);
};

// Resultados Opcion 2
const resultadosResistencias = (rf, rc) => {
  const resultados = d.getElementById("resultados");
  resultados.innerHTML = `
  <h3>Resultados: </h3>
  <p>Resistencia de Colector RC: <b>${rc} kΩ</b></p>
  <p>Resistencia de retroalimentación RF: <b>${rf} kΩ</b></p>
  `;
};
