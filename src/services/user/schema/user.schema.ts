import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/core/schema/base.schema";
import { UserStatus, VerificationStatus } from "../user.type";
import * as argon2 from "argon2";
import { Document } from "mongoose";

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User extends BaseSchema {
  @Prop({
    type: String,
    required: true,
  })
  tenantId: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Prop({
    type: String,
    required: true,
    enum: VerificationStatus,
    default: VerificationStatus.UNVERIFIED,
  })
  verificationStatus: VerificationStatus;

  @Prop({
    type: String,
    required: true,
  })
  createdBy: string;

  @Prop({
    type: String,
    required: true,
  })
  updatedBy: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document & {
  validatePassword(password: string): Promise<boolean>;
};

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    this.password = await argon2.hash(this.password);

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.validatePassword = async function (password: string) {
  return await argon2.verify(this.password, password);
};

