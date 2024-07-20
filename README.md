# LICCoursePlanner

Mi pequeño proyecto para aprender Javascript 🥳🥳 Es un planificador ultra sencillo de la malla curricular de la [Licenciatura en Ingeniería en Ciencia de la Computación (LICC)](https://admision.uc.cl/carreras/licenciatura-en-ingenieria-en-ciencia-de-la-computacion/).

### Alcance

#### Integrado

- Organización visual de cursos mediante drag & drop
- Gestión de nuevos semestres
- Integración de optativos y minors

#### TODO
- Implementar el sistema de prerequisitos
- Corregir datos de los optativos actuales
- Añadir los optativos de ciencias
- Mejorar UI (colores?)

### Forma de uso

Recomiendo que utilices [Live Server](https://www.npmjs.com/package/live-server) para correr el proyecto localmente 😇

1. Instala Live Server globalmente:
    ```bash
    npm install -g live-server
    ```

2. Clona el repositorio y navega al directorio del proyecto:
    ```bash
    git clone https://github.com/your-username/LICCoursePlanner.git
    cd LICCoursePlanner
    ```

3. Inicia Live Server desde la terminal:
    ```bash
    live-server
    ```

4. Abre tu navegador y navega a la URL proporcionada por Live Server (normalmente `http://127.0.0.1:8080`).

¡Y listo! Ya deberías poder ver y utilizar LICCoursePlanner en tu navegador.


### Sobre los datos

Si quieres editar los cursos o añadir nuevos puedes modificar los JSON que se encuentran en ```src/data```. **Asegúrate de copiar el contenido de los JSON a los respectivos archivos `.js`, ya que estos son la verdadera fuente de los datos.** 

### Colaborar

No pienso retomar el proyecto hasta un tiempo más, pero si alguien tiene interés en colaborar y expandirlo (particularmente los prerequisitos), puede contactarme en discord o telegram: @w1ndtempos 🙃