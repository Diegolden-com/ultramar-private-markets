# Captura de propiedades — Ultramar Real Estate

Esta guía es privada y sirve para convertir la información aprobada de cada propiedad
en una ficha pública. No copies este archivo ni ningún expediente fuente a
`public/`.

El sitio ya reserva tres identificadores: `property-one`, `property-two` y
`property-three`. Mantén una propiedad en `draft` hasta que el propietario apruebe
explícitamente cada dato que se divulgará.

## Datos por propiedad

```text
ID interno: property-one | property-two | property-three
Estado deseado: draft | teaser | published

Tipo de propiedad:
Nombre público:
Ubicación pública (general o exacta, según autorización):
Encabezado público / resumen de una línea:

Descripción aprobada (sólo para published):
Disponibilidad comercial aprobada (sólo para published):
Fecha de revisión: AAAA-MM-DD (sólo para published)

Superficie:
Precio o modalidad de precio:
Datos verificados adicionales (etiqueta + valor):

¿Mapa público? no | sí
  Si sí: URL HTTPS, etiqueta visible y precisión aprobada: general | exacta

¿Documentos públicos? no | sí
  Si sí: nombre del documento y URL pública canónica, sin token ni query string

¿Fotos públicas? no | sí
  Si sí: archivos aprobados y texto alternativo que describa lo visible
```

## Estados de publicación

| Estado | Lo que puede aparecer |
| --- | --- |
| `draft` | Nada; no hay URL pública ni sitemap. |
| `teaser` | Sólo tipo, nombre, ubicación pública y encabezado. Nunca datos, fotos, mapa o documentos. |
| `published` | Ficha completa con descripción, disponibilidad, fecha de revisión y al menos un dato verificado. |

Una propiedad `published` sólo entra al sitemap cuando también existe un email o WhatsApp
público válido. Si hay teasers junto con propiedades publicadas, la home permanece
`noindex` para que el teaser no se filtre a buscadores.

## Fotos, mapas y documentos

- Conserva originales, escrituras, planos y material sensible fuera del repositorio.
- Reencoda las fotos aprobadas y elimina metadatos EXIF/GPS antes de subirlas a
  `public/media/`; usa rutas como `/media/propiedad-uno-frente.webp`.
- Sólo coloca documentos de difusión pública en `public/documents/`.
- Una dirección o coordenada exacta necesita aprobación explícita por propiedad. En
  ausencia de esa autorización, omite el mapa y usa una ubicación general en la
  ficha.

## Contacto de lanzamiento

Antes de mostrar una ficha pública, define al menos uno en Vercel y vuelve a
desplegar:

```text
NEXT_PUBLIC_REAL_ESTATE_CONTACT_EMAIL=ventas@dominio.com
NEXT_PUBLIC_REAL_ESTATE_CONTACT_WHATSAPP=525512345678
```

El número de WhatsApp debe incluir código de país. No uses un contacto provisional.
