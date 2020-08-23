exports.replaceVarsDef = {
  lat: 'lat',
  lng: 'lng',
}

exports.replaceVars = (str, vars) => {
  if (!str || !str.length || str.length < 5) return str
  return str.replaceAll(/\{\{([a-zA-Z])\}\}/g, (str1, str2) => {
    if (!str2 || !exports.replaceVarsDef[str2]) return str1
    return exports.replaceVarsDef[str2]
  })
}
