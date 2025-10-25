
function traducirJS(clave, reemplazos = null) {
    let texto = (window.translations && typeof window.translations[clave] !== 'undefined') 
                ? window.translations[clave] 
                : clave;
    if (reemplazos && typeof reemplazos === 'object') {
        for (const placeholder in reemplazos) {
            const regex = new RegExp('{' + placeholder + '}', 'g');
            texto = texto.replace(regex, reemplazos[placeholder]);
        }
    }
    return texto;
}
