const { DEFAULT_DESCRIPTION_FORMAT } = require('../../constants')

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

/settings ➡️ \`Inline has map\`
Inline query results include map images
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
  title: 'Default map type',
  msg: `
*Default map type*  
[Supported types](https://developers.google.com/maps/documentation/javascript/maptypes#BasicMapTypes) 

/settings  ➡️ \`Map type\`
`,
}

exports.settings_hasdesc = {
  parents: ['settings'],
  title: 'Has descriptions',
  msg: `
*Has descriptions*  

/settings  ➡️ \`Has descriptions\`
`,
}

exports.settings_format_desc = {
  parents: ['settings'],
  title: 'Format descriptions',
  msg: `
*Format descrions* 
\`any string {{lat}}:{{lng}}\`

Supported variables:
*lat*: _geo latitude_
*lng*: _geo longitude_

default: \`${DEFAULT_DESCRIPTION_FORMAT}\`

/settings  ➡️ \`Format descriptions\` 
`,
}
