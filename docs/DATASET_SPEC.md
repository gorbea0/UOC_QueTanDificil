# Especificación del dataset

Archivo esperado: `data/uoc_statistics.json`.

## Raíz

- `schema_version`: versión del esquema. El Explorer 1.0.1 admite 1 y 2.
- `generated_at`: fecha ISO 8601 de generación.
- `summary`: resumen opcional generado por el scraper.
- `degrees`: resumen opcional por titulación.
- `records`: array obligatorio de registros.

## Registro

Campos obligatorios:

- `degree`
- `semester_name`
- `semester_value`
- `subject_name`
- `subject_code`
- `language`: `es` o `ca`
- `m`: matrícula de honor
- `ex`: excelente
- `no`: notable
- `a`: aprobado
- `su`: suspenso

Campo opcional:

- `scraped_at`

Los valores de calificación se interpretan como porcentajes numéricos.
