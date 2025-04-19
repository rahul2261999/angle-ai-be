import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Status } from 'src/core/constants/global.enum';

@Schema({
  collection: 'tenants',
  timestamps: true,
})
export class Tenant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  authKey: string;

  @Prop({
    type: String,
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Prop({ required: true })
  createdBy: number;

  @Prop({ required: true })
  updatedBy: number;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
}

export type TenantDocument = Tenant & Document;
export const TenantSchema = SchemaFactory.createForClass(Tenant);
