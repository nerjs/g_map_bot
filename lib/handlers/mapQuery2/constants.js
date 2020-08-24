/**
 * id:draft|queue:{24}
 * cache:{24}
 * format:(m|s)|{lat}|{lng}|{zoom}
 */

exports.QS_REGEXP = /^(?<type>(id|cache|format))(:(?<subType>(draft|queue)))?:((?<id>[0-9a-z]{24})|((?<mapType>(m|s))\|(?<lat>[0-9\.]+)\|(?<lng>[0-9\.]+)\|(?<zoom>[0-9\.]+)))/
