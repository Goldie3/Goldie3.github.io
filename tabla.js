<script>
		const form = document.getElementById('studentForm');
		const fields = ['name', 'rut', 'course', 'email'];
		const tableBody = document.getElementById('studentTableBody');
		const emptyState = document.getElementById('emptyState');
		const searchInput = document.getElementById('searchInput');
		const submitButton = document.getElementById('submitButton');
		const cancelButton = document.getElementById('cancelButton');
		const formTitle = document.getElementById('formTitle');
		const recordCount = document.getElementById('recordCount');
		let students = JSON.parse(localStorage.getItem('students') || '[]');

		function saveStudents() {
			localStorage.setItem('students', JSON.stringify(students));
		}

		function renderStudents() {
			const query = searchInput.value.trim().toLowerCase();
			const visibleStudents = students.filter(student =>
				fields.some(field => student[field].toLowerCase().includes(query))
			);
			tableBody.innerHTML = visibleStudents.map(student => `
				<tr>
					<td data-label="Nombre">${student.name}</td>
					<td data-label="RUT">${student.rut}</td>
					<td data-label="Curso">${student.course}</td>
					<td data-label="Correo">${student.email}</td>
					<td data-label="Acciones" class="row-actions">
						<button class="edit-button" type="button" data-action="edit" data-id="${student.id}">Editar</button>
						<button class="delete-button" type="button" data-action="delete" data-id="${student.id}">Eliminar</button>
					</td>
				</tr>`).join('');
			emptyState.hidden = visibleStudents.length > 0;
			emptyState.textContent = students.length && !visibleStudents.length
				? 'No encontramos estudiantes con esa búsqueda.'
				: 'Todavía no hay estudiantes registrados.';
			recordCount.textContent = `${students.length} ${students.length === 1 ? 'registro' : 'registros'}`;
		}

		function resetForm() {
			form.reset();
			document.getElementById('studentId').value = '';
			formTitle.textContent = 'Agregar estudiante';
			submitButton.textContent = 'Agregar estudiante';
			cancelButton.classList.add('hidden');
		}

		form.addEventListener('submit', event => {
			event.preventDefault();
			const student = Object.fromEntries(fields.map(field => [field, document.getElementById(field).value.trim()]));
			const id = document.getElementById('studentId').value;
			if (id) {
				students = students.map(item => item.id === id ? { ...item, ...student } : item);
			} else {
				students.push({ id: crypto.randomUUID(), ...student });
			}
			saveStudents();
			resetForm();
			renderStudents();
		});

		tableBody.addEventListener('click', event => {
			const button = event.target.closest('button');
			if (!button) return;
			const student = students.find(item => item.id === button.dataset.id);
			if (button.dataset.action === 'delete' && student && confirm(`¿Eliminar a ${student.name}?`)) {
				students = students.filter(item => item.id !== student.id);
				saveStudents();
				renderStudents();
			}
			if (button.dataset.action === 'edit' && student) {
				document.getElementById('studentId').value = student.id;
				fields.forEach(field => document.getElementById(field).value = student[field]);
				formTitle.textContent = 'Editar estudiante';
				submitButton.textContent = 'Guardar cambios';
				cancelButton.classList.remove('hidden');
				document.getElementById('name').focus();
			}
		});

		cancelButton.addEventListener('click', resetForm);
		searchInput.addEventListener('input', renderStudents);
		renderStudents();
	</script>