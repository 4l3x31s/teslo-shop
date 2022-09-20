import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { MinKey } from "typeorm";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(()=> Number)
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(()=> Number) //convertir implicitamente a numero
    offset?: number;
}