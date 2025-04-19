import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { plainToClass } from 'class-transformer';
import { TenantResponseDto } from './dto/tenant-response.dto';
import SuccessResponse from 'src/core/response/response.util';

@Controller({
  path: 'tenant',
  version: '1',
})
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  public async create(@Body() createTenantDto: CreateTenantDto) {
    const data = await this.tenantService.create(createTenantDto);

    const resDto = plainToClass(TenantResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponse('Tenant created successfully', {
      data: resDto,
    });
  }

  @Get()
  public async findAll() {
    const data = await this.tenantService.findAll();

    const resDto = plainToClass(TenantResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponse('Tenants fetched successfully', {
      data: resDto,
    });
  }

  @Get(':tenantId')
  public async findOne(@Param('tenantId') tenantId: string) {
    const data = await this.tenantService.findOne(tenantId);

    const resDto = plainToClass(TenantResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new SuccessResponse('Tenant fetched successfully', {
      data: resDto,
    });
  }

  @Patch(':tenantId')
  public async update(
    @Param('tenantId') tenantId: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    await this.tenantService.update(tenantId, updateTenantDto);

    return new SuccessResponse('Tenant updated successfully');
  }

  @Delete(':tenantId')
  public async remove(@Param('tenantId') tenantId: string) {
    await this.tenantService.remove(tenantId);

    return new SuccessResponse('Tenant deleted successfully');
  }
}
