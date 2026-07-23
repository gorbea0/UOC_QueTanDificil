# UOC Grade Explorer 1.0.1 — GitHub Pages Edition

Aplicación web estática para consultar las estadísticas generadas por **UOC Statistics Scraper**.

## Publicación

El contenido de este directorio se puede subir directamente a la raíz de un repositorio de GitHub Pages:

```text
index.html
css/
js/
data/uoc_statistics.json
```

No requiere Python, Node, compilación, base de datos ni servidor propio. GitHub Pages sirve los archivos estáticos y la aplicación carga el dataset mediante:

```javascript
fetch("data/uoc_statistics.json")
```

## Actualización semestral

1. Ejecutar el scraper en el ordenador local.
2. Sustituir `data/uoc_statistics.json` por el nuevo fichero.
3. Confirmar los cambios y hacer `git push`.
4. GitHub Pages publicará automáticamente el dataset actualizado.

## Activar GitHub Pages

En el repositorio: **Settings → Pages → Deploy from a branch → `main` → `/ (root)`**.

## Prueba local

Abrir `index.html` directamente con `file://` puede impedir la carga del JSON por las restricciones del navegador. Esto no ocurre en GitHub Pages. Para pruebas locales puede utilizarse cualquier servidor estático, pero no forma parte ni es requisito del proyecto publicado.
