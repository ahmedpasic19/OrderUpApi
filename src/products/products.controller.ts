import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get(':page/:pageSize')
  findAll(@Param('page') page: number, @Param('pageSize') pageSize: number) {
    return this.productsService.findAll(+page, +pageSize);
  }

  @Get(':organisation_id/:page/:pageSize')
  findAllOrgProducts(
    @Param('page') page: number,
    @Param('pageSize') pageSize: number,
    @Param('organisation_id') organisation_id: number,
  ) {
    return this.productsService.findAllOrgProducts(+page, +pageSize, +organisation_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
