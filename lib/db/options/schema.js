const { Schema } = require('mongoose')

exports.TYPES = {
  STRING: 'str',
  NUMBER: 'num',
  BOOL: 'bool',
  DATE: 'date',
}

exports.schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    kind: {
      type: String,
      enum: Object.values(exports.TYPES),
      required: true,
    },
  },
  { discriminatorKey: 'kind', skipVersioning: true },
)

exports.numberSchema = new Schema(
  {
    [exports.TYPES.NUMBER]: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
)

exports.stringSchema = new Schema(
  {
    [exports.TYPES.STRING]: {
      type: String,
      required: true,
    },
  },
  { _id: false },
)

exports.boolSchema = new Schema(
  {
    [exports.TYPES.BOOL]: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
)

exports.dateSchema = new Schema(
  {
    [exports.TYPES.DATE]: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
)
