const { DEFAULT_DESCRIPTION_FORMAT, DEFAULT_ZOOM, SEARCH_TEXT } = require('../../constants')

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
The search bar is similar to finding places in google maps. 
Long from ${SEARCH_TEXT.MIN} characters to ${SEARCH_TEXT.MAX}.
`,
}

// TODO: Описание
exports.url = {
  title: 'Url',
  msg: `
*Url help*
\/url \`....url string\`
Google maps url.

*Examples:*
\`/url https://www.google.com/maps/@50.4373352,30.5495594,12z\`
or short link:
\`/url https://goo.gl/maps/wF7Qb3p248p9LwLf9\`
`,
}

exports.coordinates = {
  title: 'Coordinates',
  msg: `
*Coordinates help*
\/coordinates \`...formatted coords\`
or\:
\/coords \`...formatted coords\`

*Format coordinates:*
\`{type}:{notExists}:{lat}:{lng}:{zoom}\`

• *type* - (optional) (map | satellite | photo). default photo
• *notExists* - (optional) ( map | satellite). default - map.
• *lat* - (required) geo latitude. Number from \`-90\` to \`90\`.
• *lng* - (required) geo longitude. Number from \`-180\` to \`180\`.
• *zoom* - (optional). Number from 1 to 21. default - your default zoom ( /help  ➡️ \`settings\` ➡️ \`Default zoom\` ) or ${DEFAULT_ZOOM}.

• separator: \`:\`, \`,\` or space

*Examples:*
\`/coords 50.4435148:30.515266\`
\`/coordinates photo 47.8356579 35.1148923\`
\`/coords satellite:51.5007325:-0.1268141:17\`
\`/coords photo map 49.6015195 -34.0276277\`
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

exports.default_zoom = {
  parents: ['settings'],
  title: 'Default zoom',
  msg: `
Default zoom  
`,
}

// TODO: Not supported
exports.settings_format_desc = {
  parents: ['settings'],
  title: 'Format descriptions',
  msg: `
\`Not supported\`
*Format descrions* 
\`any string {{lat}}:{{lng}}\`

Supported variables:
*lat*: _geo latitude_
*lng*: _geo longitude_

default: \`${DEFAULT_DESCRIPTION_FORMAT}\`

/settings  ➡️ \`Format descriptions\` 
`,
}
