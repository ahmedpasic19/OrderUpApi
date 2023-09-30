import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  async create(createProductDto: CreateProductDto) {
    const findOrg = await prisma.organisation.findUnique({
      where: { id: +createProductDto.organisation_id },
    });

    if (!findOrg) {
      return { message: `Organisation with ID ${+createProductDto.organisation_id} was not found` };
    }

    const product = await prisma.product.create({
      data: {
        name: createProductDto.name,
        weight: +createProductDto.weight,
        price: +createProductDto.price,
        organisation_id: +createProductDto.organisation_id,
      },
    });

    return { message: 'Product created', product };
  }

  async findAll(page: number, pageSize: number) {
    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return products;
  }

  async findAllOrgProducts(page: number, pageSize: number, organisation_id: number) {
    const products = await prisma.product.findMany({
      where: {
        organisation_id,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return products;
  }

  async findOne(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const findProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!findProduct) {
      return { message: `Product with ID ${id} was not found` };
    }

    const findOrg = await prisma.organisation.findUnique({
      where: { id: +updateProductDto.organisation_id },
    });

    if (!findOrg) {
      return { message: `Organisation with ID ${+updateProductDto.organisation_id} was not found` };
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        weight: +updateProductDto.weight,
        price: +updateProductDto.price,
        organisation_id: +updateProductDto.organisation_id,
      },
    });

    return { message: 'Product successfully updated', product };
  }

  async remove(id: number) {
    const find = await prisma.product.findUnique({
      where: { id },
    });

    if (!find) {
      return { message: `Product with ID ${id} was not found` };
    }

    const product = await prisma.product.delete({
      where: { id },
    });

    return { message: 'Product successfully removed', product };
  }
}
