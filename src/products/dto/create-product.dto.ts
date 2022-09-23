
import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray, IsIn, IsInt, IsNumber, IsOptional,
    IsPositive, IsString, MinLength
} from 'class-validator';

export class CreateProductDto {

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true,
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        example: '0',
        description: 'Product price'
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 'lorem ipsum',
        description: 'Product description',
        default: null,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG for SEO',
        uniqueItems: true
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: 0
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product sizes',
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        example: ['steam', 'example'],
        description: 'Product sizes',
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        example: ['t_shirt_teslo.jpg'],
        description: 'Product Stock'
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

}
