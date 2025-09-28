import { Schema, models, model } from 'mongoose';

const CareerApplicationSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  place: { type: String, required: true },
  department: { type: String, required: true }, // store label for readability
  resume: { type: String, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

CareerApplicationSchema.virtual('id').get(function() { return this._id.toString(); });
CareerApplicationSchema.set('toJSON', { virtuals: true, versionKey: false, transform: (_doc: any, ret: any) => { delete ret._id; } });
CareerApplicationSchema.set('toObject', { virtuals: true });

export const CareerApplicationModel = models.CareerApplication || model('CareerApplication', CareerApplicationSchema);
