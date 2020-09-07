const yup = require('yup')
const { max } = require('moment')

const latSchema = yup
  .number()
  .min(-90)
  .max(90)

const lngSchema = yup
  .number()
  .min(-180)
  .max(180)

const zoomSchema = yup
  .number()
  .min(0)
  .max(21)

const latlngSchema = yup.object().shape({
  lat: latSchema.required(),
  lng: lngSchema.required(),
})

const coordsFormatSchema = latlngSchema.concat(
  yup.object().shape({
    zoom: zoomSchema,
  }),
)

module.exports = {
  latSchema,
  lngSchema,
  zoomSchema,
  latlngSchema,
  coordsFormatSchema,
}
