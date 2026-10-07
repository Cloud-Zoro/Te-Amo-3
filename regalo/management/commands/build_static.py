"""
Genera la versión estática del regalo en la carpeta /docs
para publicarla gratis en GitHub Pages.

Uso:  python manage.py build_static
"""
import shutil
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.template.loader import render_to_string

from regalo.contenido import CONFIG


class Command(BaseCommand):
    help = "Genera el sitio estático en /docs (para GitHub Pages)"

    def handle(self, *args, **options):
        destino = Path(settings.BASE_DIR) / "docs"
        if destino.exists():
            shutil.rmtree(destino)
        destino.mkdir()

        html = render_to_string("regalo/index.html", {"c": CONFIG})
        # Rutas relativas para que funcione en tuusuario.github.io/nombre-repo/
        html = html.replace('"/static/', '"static/')
        (destino / "index.html").write_text(html, encoding="utf-8")

        origen = Path(settings.BASE_DIR) / "regalo" / "static"
        shutil.copytree(origen, destino / "static")
        (destino / ".nojekyll").touch()

        self.stdout.write(self.style.SUCCESS(f"Listo: sitio generado en {destino}"))
