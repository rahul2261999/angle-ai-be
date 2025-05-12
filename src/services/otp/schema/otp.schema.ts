import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  collection: 'otps',
  timestamps: true,
})
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;  

  @Prop({ required: true, default: 0 })
  count: number;

  @Prop({ required: true, default: Date.now() })
  lastSentAt: Date; 
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
export type OtpDocument = Otp & Document;