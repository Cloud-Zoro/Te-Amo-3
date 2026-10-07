from django.shortcuts import render

from .contenido import CONFIG


def inicio(request):
    return render(request, "regalo/index.html", {"c": CONFIG})
