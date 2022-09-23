import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { MinKey } from "typeorm";

export class PaginationDto {

    @ApiProperty({
        description: 'How many rows do you many',
        default: 10
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        description: 'How many rows do you want to skip',
        default: 0
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number) //convertir implicitamente a numero
    offset?: number;
}