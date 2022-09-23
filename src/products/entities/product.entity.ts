import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: 'ccb0eb77-87b1-4307-b4fa-7b930cf15953',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: '0',
        description: 'Product price'
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'lorem ipsum',
        description: 'Product description',
        default: null,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: 0
    })
    @Column('int', {
        default: 0,
    })
    stock: number;

    @ApiProperty(
        {
            example: ['M', 'XL', 'XXL'],
            description: 'Product sizes',
        }
    )
    @Column('text', {
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example: 'Women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['steam', 'example'],
        description: 'Product sizes',
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty({
        example: ['t_shirt_teslo.jpg'],
        description: 'Product Stock'
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true //para cargar todas las relaciones
        }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User


    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.changeChain(this.slug);
    }
    @BeforeUpdate()
    checkSlugUpdate() {
        /*if(!this.slug){
            this.slug = this.title;
        }*/
        this.slug = this.changeChain(this.slug);
    }

    private changeChain(term: string) {
        return term
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
