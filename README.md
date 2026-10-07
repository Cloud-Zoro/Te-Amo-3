# 🎵 Regalo para mi novia: Una canción solo para ti

Mini-experiencia web hecha con Django: preguntas de pareja (y de Miku), una melodía que se arma
nota por nota en un "piano roll" estilo editor de voz, un botón "No" que se escapa y una carta final.

## 1. Personalizar (lo más importante)
Abre `regalo/contenido.py` y cambia:
- `nombre_ella`, `tu_nombre`, `carta` y las `preguntas` (hay comentarios que explican cada campo).
- En las preguntas de pareja pon `"correcta": N` con el número de la opción real (0 = primera),
  o déjalo en `None` para que cualquier respuesta sea válida.

**Fotos:** copia tus imágenes a `regalo/static/regalo/img/` y escribe sus nombres en `"fotos": [...]`.
**Música:** copia un .mp3 a `regalo/static/regalo/audio/` y escribe su nombre en `"musica": "cancion.mp3"`.

## 2. Probarlo en tu computador
```bash
python -m venv venv
venv\Scripts\activate        # en Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```
Abre http://127.0.0.1:8000

## 3. Publicarlo en GitHub Pages (gratis)
GitHub Pages solo sirve archivos estáticos, así que Django "congela" el sitio en la carpeta `docs/`:
```bash
python manage.py build_static
```
Luego:
1. Crea un repositorio en GitHub y sube todo el proyecto (incluida la carpeta `docs/`).
2. En el repo: **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch**. Branch: **main** y carpeta **/docs**. Guarda.
4. En 1 o 2 minutos tendrás tu link: `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

> Cada vez que cambies algo en `contenido.py`, fotos o música: vuelve a correr
> `python manage.py build_static`, haz commit y push.

Tip: si el repo es público, cualquiera con el link podría verlo. Usa un nombre de repo poco obvio.
