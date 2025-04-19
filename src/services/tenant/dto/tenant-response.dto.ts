import { Expose, Transform } from 'class-transformer';
import { Status } from 'src/core/constants/global.enum';

export class TenantResponseDto {
  @Expose({ name: '_id' })
  @Transform(({ obj }: { obj: { _id: { toString: () => string } } }) =>
    obj._id.toString(),
  )
  id: string;

  @Expose()
  name: string;

  @Expose()
  tenantId: string;

  @Expose()
  authKey: string;

  @Expose()
  status: Status;

  @Expose()
  createdBy: number;

  @Expose()
  updatedBy: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
