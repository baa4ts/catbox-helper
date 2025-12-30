let enlaces = []

// obtener todos los .textHolder de la pestaña activa
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            func: () => {
                const elementos = Array.from(document.querySelectorAll('.textHolder'))
                return elementos.map(e => e.textContent.trim())
            },
        },
        (results) => {
            enlaces = results[0]?.result || []
            renderContenido(enlaces)
        }
    )
})

// renderizar los articulos en el popup
function renderContenido(lista) {
    const contenedor = document.getElementById('contenido')
    contenedor.innerHTML = lista
        .map(
            (url, i) => `
        <article>
          <span>${i + 1}</span>
          <p>${url}</p>
        </article>
      `
        )
        .join('')
}

// convertir a archivo descargable
function descargar(nombre, contenido) {
    const blob = new Blob([contenido], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nombre
    a.click()
    URL.revokeObjectURL(url)
}

// funciones exportar
function exportarJSON() {
    const data = JSON.stringify(enlaces, null, 2)
    descargar('catbox_links.json', data)
}

function exportarCSV() {
    const data = enlaces.map((e, i) => `${i + 1},${e}`).join('\n')
    descargar('catbox_links.csv', data)
}

function exportarTXT() {
    const data = enlaces.join('\n')
    descargar('catbox_links.txt', data)
}

// eventos botones
document.getElementById('btn-json').addEventListener('click', exportarJSON)
document.getElementById('btn-csv').addEventListener('click', exportarCSV)
document.getElementById('btn-txt').addEventListener('click', exportarTXT)
