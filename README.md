# Cloud Computing — Sistema de Registro de Estudiantes

Sistema creado en la asignatura **Computación en la Nube** del Instituto Profesional Santo Tomás. Permite registrar, editar, buscar y eliminar estudiantes, con persistencia en tiempo real usando **Firebase Firestore**, ademas con la version local de LocalStorage.

## Ver el sitio en GitHub Pages

El sitio ya está publicado y funcionando en:

**https://goldie3.github.io/**

## Cómo iniciar el proyecto desde GitHub Pages (paso a paso)

Para poder publicar tu propia copia o revisar cómo está configurado:

1. **Ve a la configuración del repositorio** en GitHub: `Settings` → `Pages` (menú lateral izquierdo).
2. En **Build and deployment**, la opción **Source** debe estar en `Deploy from a branch`.
3. En **Branch**, selecciona `main` y la carpeta `/ (root)`, luego haz clic en `Save`.
4. Espera 1–2 minutos. GitHub Pages publicará el sitio en:
   `https://<tu-usuario>.github.io/`
5. Cada vez que hagas `git push` a la rama `main`, el sitio se actualiza automáticamente solo (no requiere ningún build ni comando adicional).


## Probarlo Localmente

Se necesitara instalar una extensión de VS code para poder iniciar el proyecto de forma loca:

**Live Server**
1. Instala la extensión "Live Server" en VS Code.
2. Clic derecho sobre `index.html` y selecciona `Open with Live Server`.


## Estructura del proyecto

```
├── index.html                     # Página de inicio
├── html/
│   ├── tabladatosfirebase.html    # Sistema conectado a Firebase (recomendado)
│   └── tabladatos.html            # Versión con LocalStorage (datos guardados en navegador de forma local)
├── css/
│   └── style.css
├── js/
│   ├── firebase-config.js         # Configuración/credenciales de Firebase
│   └── tabla-firebase.js          # Lógica CRUD (agregar, editar, eliminar, buscar)z
│   └── tabla.js                   # Lógica CRUD pero con LocalStorage
└── package.json                   # Dependencia de firebase (referencia, no build)
```

## Datos en Firebase

Los datos de los estudiantes se guardan en FireStore, en la colección `estudiantes`. La conexión ya está configurada en `js/firebase-config.js` con las credenciales del proyecto `computacionenlanuba`.


## Firebase VS LocalStorage y flujo de datos

El cambio de LocalStorage a Firebase es muy notorio, ya que LocalStorage almacena los datos en el navegador utilizado al guardar el dato, osea que si cambias de navegador, los datos serán difrentes, en cambio FireBase (este es como un backend en la nube) con FireStore al ser una base de datos en la nube, los
datos serán mostrados de forma global, osea que ninguna persona tiene datos diferentes, ya que están conectados a la misma base de datos.


El flujo de datos seria: Formulario → Firebase → Firestore (nube)  → Respuesta.

