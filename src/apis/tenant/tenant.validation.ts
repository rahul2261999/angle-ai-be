import { z } from "zod";
import { Status } from "./tenant.enum";

abstract class TenantValidation {
  public static tenantCreate = z.object({
    name: z.string({ message: "name can not be empty or null" }).min(3, "name can not be less than 3 charactter").max(100, "name can not be more than 100 characters"),
  });

  public static tenantGet = z.object({
    id: z.number({ message: "id can not be empty or null" }),
  })

  public static tenantGetAll = z.object({});

  public static tenantUpdate = z.object({
    values: z.object({
      name: z.string().min(3, "name can not be less than 3 characters").max(100, "name can not be more than 100 characters").optional(),
      status: z.nativeEnum(Status).optional(),
      updatedBy: z.number({ message: "updatedBy can not be empty or null" }),
    }),

    filter: z.object({
      id: z.number({ message: "id can not be empty or null" }),
    }).required()
  });

  public static tenantDelete = z.object({
    id: z.number({ message: "id can not be empty or null" }),
  })
}

export { TenantValidation }