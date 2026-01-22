import mongoose, { Schema } from "mongoose";

const CveSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    published: { type: Date, required: true },
    lastModified: { type: Date, required: true },
    cvss: { type: Number, default: null },
    source: { type: String, default: "NVD" },
    new:{type:Boolean, default:true}
  },
  { timestamps: true }
);


CveSchema.index({ published: -1 });

export const Cve =  mongoose.model("Cve", CveSchema);
