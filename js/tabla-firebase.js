import { db } from "/js/firebase-config.js";
import {
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	orderBy
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const studentsCol = collection(db, "estudiantes");
const q = query(studentsCol, orderBy("name"));

const form = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const rutInput = document.getElementById("rut");
const courseInput = document.getElementById("course");
const emailInput = document.getElementById("email");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const searchInput = document.getElementById("searchInput");

const tableBody = document.getElementById("studentTableBody");
const emptyState = document.getElementById("emptyState");
const recordCount = document.getElementById("recordCount");

let students = []; 

export function validarRut(rut) {
	// Validación simple de formato chileno: 12.345.678-9 o 12345678-9
	const limpio = rut.replace(/\./g, "").replace(/-/g, "");
	if (!/^\d{7,8}[0-9kK]$/.test(limpio)) return false;

	const cuerpo = limpio.slice(0, -1);
	const dv = limpio.slice(-1).toUpperCase();

	let suma = 0, multiplo = 2;
	for (let i = cuerpo.length - 1; i >= 0; i--) {
		suma += parseInt(cuerpo[i]) * multiplo;
		multiplo = multiplo === 7 ? 2 : multiplo + 1;
	}
	const resto = 11 - (suma % 11);
	const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);

	return dv === dvEsperado;
}

onSnapshot(q, (snapshot) => {
	students = snapshot.docs.map((docSnap) => ({
		id: docSnap.id,
		...docSnap.data()
	}));
	renderTable(students);
});


function renderTable(list) {
	const filterText = searchInput.value.trim().toLowerCase();
	const filtered = filterText
		? list.filter((s) =>
				[s.name, s.rut, s.course].some((field) =>
					(field || "").toLowerCase().includes(filterText)
				)
			)
		: list;

	tableBody.innerHTML = "";

	filtered.forEach((student) => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${escapeHtml(student.name)}</td>
			<td>${escapeHtml(student.rut)}</td>
			<td>${escapeHtml(student.course)}</td>
			<td>${escapeHtml(student.email)}</td>
			<td class="actions-cell">
				<button class="secondary-button edit-button" data-id="${student.id}">Editar</button>
				<button class="secondary-button danger-button" data-id="${student.id}">Eliminar</button>
			</td>
		`;
		tableBody.appendChild(row);
	});

	emptyState.classList.toggle("hidden", filtered.length > 0);
	recordCount.textContent = `${list.length} registro${list.length === 1 ? "" : "s"}`;
}

function escapeHtml(text) {
	const div = document.createElement("div");
	div.textContent = text ?? "";
	return div.innerHTML;
}


form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const payload = {
		name: nameInput.value.trim(),
		rut: rutInput.value.trim(),
		course: courseInput.value.trim(),
		email: emailInput.value.trim()
	};

	// Validar RUT
	if (!validarRut(payload.rut)) {
		alert("RUT inválido.");
		return;
	}

	try {
		submitButton.disabled = true;

		if (studentIdInput.value) {
			// Editar
			await updateDoc(doc(db, "estudiantes", studentIdInput.value), payload);
		} else {
			// Agregar
			await addDoc(studentsCol, payload);
		}

		resetForm();
	} catch (error) {
		console.error("Error guardando estudiante:", error);
		alert("Ocurrió un error al guardar. Revisa la consola.");
	} finally {
		submitButton.disabled = false;
	}
});


tableBody.addEventListener("click", async (event) => {
	const id = event.target.dataset.id;
	if (!id) return;

	if (event.target.classList.contains("edit-button")) {
		const student = students.find((s) => s.id === id);
		if (!student) return;

		studentIdInput.value = student.id;
		nameInput.value = student.name;
		rutInput.value = student.rut;
		courseInput.value = student.course;
		emailInput.value = student.email;

		submitButton.textContent = "Guardar cambios";
		cancelButton.classList.remove("hidden");
		nameInput.focus();
	}

	if (event.target.classList.contains("danger-button")) {
		const confirmDelete = confirm("¿Eliminar este estudiante?");
		if (!confirmDelete) return;

		try {
			await deleteDoc(doc(db, "estudiantes", id));
		} catch (error) {
			console.error("Error eliminando estudiante:", error);
			alert("Ocurrió un error al eliminar. Revisa la consola.");
		}
	}
});


cancelButton.addEventListener("click", resetForm);

function resetForm() {
	form.reset();
	studentIdInput.value = "";
	submitButton.textContent = "Agregar estudiante";
	cancelButton.classList.add("hidden");
}


searchInput.addEventListener("input", () => renderTable(students));