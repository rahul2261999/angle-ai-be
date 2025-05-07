import { Expose, Transform } from "class-transformer";
import { UserStatus, VerificationStatus } from "../user.type";

export class UserResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  tenantId: string;

  @Expose()
  email: string;

  @Expose()
  status: UserStatus;

  @Expose()
  verificationStatus: VerificationStatus;

  @Expose()
  createdBy: string;

  @Expose()
  updatedBy: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
