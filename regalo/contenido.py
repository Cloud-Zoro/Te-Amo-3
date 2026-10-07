"""
==========================================================
  AQUÍ EDITAS TODO EL CONTENIDO DEL REGALO
  (no necesitas tocar nada más para personalizarlo)
==========================================================
"""

CONFIG = {
    # Cómo le dices a ella y cómo firmas tú
    "nombre_ella": "mi amor",
    "tu_nombre": "Tu nombre",

    # Texto de la pantalla de inicio
    "titulo": "Una canción solo para ti",
    "subtitulo": "Cada respuesta que des hará sonar una nota. Al final se escucha nuestra melodía.",

    # Nombre del archivo de música (opcional). Ponlo dentro de:
    #   regalo/static/regalo/audio/   Ejemplo: "cancion.mp3"
    # Déjalo vacío ("") si no quieres música de fondo.
    "musica": "",

    # Fotos para la galería final (opcional). Ponlas dentro de:
    #   regalo/static/regalo/img/     Ejemplo: ["foto1.jpg", "foto2.jpg"]
    "fotos": [],

    # Pregunta final (el botón "No" se escapa del cursor 😈)
    "pregunta_final": "¿Me quieres tanto como Miku quiere a su puerro?",
    "si_texto": "Sí, muchísimo",
    "no_texto": "No",
    "no_mensajes": [
        "No",
        "¿Segura?",
        "Piénsalo bien…",
        "Ese botón está roto",
        "Mejor di que sí :3",
    ],

    # La carta final. Cada elemento es un párrafo.
    "carta": [
        "Quería regalarte algo diferente, algo que hiciera sonar tu mundo.",
        "Gracias por cada risa, por cada canción compartida y por hacerme sentir en casa.",
        "Escribe aquí lo que de verdad sientes. Esta carta es tuya.",
    ],

    # ------------------------------------------------------
    # PREGUNTAS
    #   "correcta": número de la opción correcta (0 = la primera)
    #   "correcta": None  -> no hay respuesta mala, cualquiera suena bien
    #   "ok" = mensaje si acierta, "mal" = mensaje si falla (puede reintentar)
    # ------------------------------------------------------
    "preguntas": [
        {
            "texto": "¿De qué color es el cabello de Miku?",
            "opciones": ["Rosa", "Turquesa", "Morado", "Rubio"],
            "correcta": 1,
            "ok": "¡Turquesa, como el cielo cuando estoy contigo!",
            "mal": "Uy, eso no es… ¡inténtalo otra vez!",
        },
        {
            "texto": "¿Cuál es la verdura favorita de Miku?",
            "opciones": ["Zanahoria", "Brócoli", "Puerro (negi)", "Tomate"],
            "correcta": 2,
            "ok": "¡Claro que sí! Miku y su puerro, inseparables.",
            "mal": "Mmm, casi… pista: es larga y verde.",
        },
        {
            "texto": "¿Qué día es el cumpleaños de Miku?",
            "opciones": ["31 de agosto", "14 de febrero", "1 de enero", "25 de diciembre"],
            "correcta": 0,
            "ok": "¡Exacto! Ya sabes cuándo hay fiesta.",
            "mal": "No es ese día. ¡Otra vez!",
        },
        {
            "texto": "¿Dónde fue nuestra primera cita?",
            "opciones": ["En un parque", "En un café", "En el cine", "En casa"],
            "correcta": None,   # EDITA: pon el número de la opción real
            "ok": "¡Qué recuerdo tan lindo!",
            "mal": "",
        },
        {
            "texto": "¿Cuál es nuestra comida favorita para compartir?",
            "opciones": ["Pizza", "Sushi", "Helado", "Completos"],
            "correcta": None,
            "ok": "¡Ahora me dio hambre!",
            "mal": "",
        },
        {
            "texto": "¿Qué es lo que más te gusta hacer cuando estamos juntos?",
            "opciones": [
                "Ver series o películas",
                "Salir a caminar",
                "Escuchar música",
                "Quedarnos conversando",
            ],
            "correcta": None,
            "ok": "A mí también me encanta eso contigo.",
            "mal": "",
        },
        {
            "texto": "¿Cuánto te quiero?",
            "opciones": [
                "Mucho",
                "Muchísimo",
                "Hasta la luna",
                "Más que a todos los puerros del mundo",
            ],
            "correcta": None,
            "ok": "¡Todas son correctas, y se quedan cortas!",
            "mal": "",
        },
    ],
}
