import { Schema, models, model } from 'mongoose';

// Mirror src/types/works.ts structure
const WorkImageSchema = new Schema({
  url: { type: String, required: false },
  alt: { type: String, required: false, default: 'Work image' },
}, { _id: false });

const WorkSchema = new Schema({
  title: { type: String, required: true },
  image: { type: WorkImageSchema, required: false }, // made optional
  videoId: { type: String },
  published: { type: Boolean, default: false },
  order: { type: Number, required: true, index: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

// Provide a virtual id field mapping to _id as string
WorkSchema.virtual('id').get(function() { return this._id.toString(); });
WorkSchema.set('toJSON', { virtuals: true, versionKey: false, transform: (_doc: any, ret: any) => { delete ret._id; } });
WorkSchema.set('toObject', { virtuals: true });

export const WorkModel = models.Work || model('Work', WorkSchema);
