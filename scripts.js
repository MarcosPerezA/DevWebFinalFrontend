const baseUrl = 'http://localhost:3000'; 

let authToken = null;

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo: email, clave: password })
    })
    .then(response => response.json())
    .then(data => {
        authToken = data.token;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('createForm').style.display = 'block';
        document.getElementById('patientList').style.display = 'block';
        loadPacientes();
    })
    .catch(error => {
        console.error(error);
        alert('Error de inicio de sesión');
    });
}

function logout() {
    authToken = null;
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('createForm').style.display = 'none';
    document.getElementById('patientList').style.display = 'none';
}

function createPaciente() {
    const nombre = document.getElementById('nombre').value;
    const edad = document.getElementById('edad').value;
    const diagnostico = document.getElementById('diagnostico').value;
    const medicos = document.getElementById('medicos').value.split(',');
    const fechaUltimaCita = document.getElementById('fechaUltimaCita').value;
    const direccion = document.getElementById('direccion').value;
    const numeroTelefono = document.getElementById('numeroTelefono').value;
    const correo = document.getElementById('correo').value;

    fetch(`${baseUrl}/pacientes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken
        },
        body: JSON.stringify({
            nombre,
            edad,
            diagnostico,
            medicos,
            fechaUltimaCita,
            direccion,
            numeroTelefono,
            correo
        })
    })
    .then(response => response.json())
    .then(data => {
        loadPacientes();
    })
    .catch(error => {
        console.error(error);
        alert('Error al crear paciente');
    });
}

function loadPacientes() {
    fetch(`${baseUrl}/pacientes`, {
        headers: {
            'auth-token': authToken
        }
    })
    .then(response => response.json())
    .then(data => {
        const patientTable = document.getElementById('patientTable');
        patientTable.innerHTML = ''; 

        data.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" id="editNombre_${patient._id}" value="${patient.nombre}"></td>
                <td><input type="number" id="editEdad_${patient._id}" value="${patient.edad}"></td>
                <td><input type="text" id="editDiagnostico_${patient._id}" value="${patient.diagnostico}"></td>
                <td><input type="text" id="editMedicos_${patient._id}" value="${patient.medicos.join(', ')}"></td>
                <td><input type="text" id="editFechaUltimaCita_${patient._id}" value="${patient.fechaUltimaCita}"></td>
                <td><input type="text" id="editDireccion_${patient._id}" value="${patient.direccion}"></td>
                <td><input type="text" id="editNumeroTelefono_${patient._id}" value="${patient.numeroTelefono}"></td>
                <td><input type="text" id="editCorreo_${patient._id}" value="${patient.correo}"></td>
                <td><button onclick="updatePaciente('${patient._id}')">Actualizar</button></td>
                <td><button onclick="deletePaciente('${patient._id}')">Eliminar</button></td>
            `;
            patientTable.appendChild(row);
        });
    })
    .catch(error => {
        console.error(error);
        alert('Error al cargar la lista de pacientes');
    });
}


// ...

function updatePaciente(id) {
    const nombre = document.getElementById(`editNombre_${id}`).value;
    const edad = document.getElementById(`editEdad_${id}`).value;
    const diagnostico = document.getElementById(`editDiagnostico_${id}`).value;
    const medicos = document.getElementById(`editMedicos_${id}`).value.split(',');
    const fechaUltimaCita = document.getElementById(`editFechaUltimaCita_${id}`).value;
    const direccion = document.getElementById(`editDireccion_${id}`).value;
    const numeroTelefono = document.getElementById(`editNumeroTelefono_${id}`).value;
    const correo = document.getElementById(`editCorreo_${id}`).value;

    // Enviar solicitud PUT para actualizar el paciente
    fetch(`${baseUrl}/pacientes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken
        },
        body: JSON.stringify({
            nombre,
            edad,
            diagnostico,
            medicos,
            fechaUltimaCita,
            direccion,
            numeroTelefono,
            correo
        })
    })
    .then(response => response.json())
    .then(data => {
        loadPacientes();
    })
    .catch(error => {
        console.error(error);
        alert('Error al actualizar el paciente');
    });
}

function deletePaciente(id) {
    // Enviar solicitud DELETE para eliminar el paciente
    fetch(`${baseUrl}/pacientes/${id}`, {
        method: 'DELETE',
        headers: {
            'auth-token': authToken
        }
    })
    .then(response => response.json())
    .then(data => {
        loadPacientes();
    })
    .catch(error => {
        console.error(error);
        alert('Error al eliminar el paciente');
    });
}
