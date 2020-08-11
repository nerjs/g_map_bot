exports.core = {
  title: 'Help',
  msg: `
*Core help*
\/help \`(search | url | coordinates | inline)\`
`,
}

exports.search = {
  title: 'Search',
  msg: `
*Search help*
\/search \`...search string\`
`,
}

exports.url = {
  title: 'Url',
  msg: `
*Url help*
\/url \`....url string\`
`,
}

exports.coordinates = {
  title: 'Coordinates',
  msg: `
*Coordinates help*
\/coordinates \`...formatted coords\`
or\:
\/coors \`...formatted coords\`
`,
}

exports.random = {
  title: 'Random',
  msg: `
*Random photo\/place*
\/random \`(map | satellite | place | photo | street | panorama)\`. 
default\: \`photo\`.  
`,
}

exports.inline = {
  title: 'Inline mode',
  msg: `
*Inline mode help*  
`,
}

exports.settings = {
  title: 'Settings',
  msg: `
*Settings help*
\/settings  
`,
}

exports.setting_defmap = {
  parents: ['settings'],
  title: 'Default map',
  msg: `
*Default map*  
`,
}

exports.settings_hasdesc = {
  parents: ['settings'],
  title: 'Has descriptions',
  msg: `
*Has descriptions*  
`,
}

exports.settings_format_desc = {
  parents: ['settings'],
  title: 'Format descriptions',
  msg: `
*Format descrions*  
`,
}
