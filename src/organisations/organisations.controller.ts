import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  @UsePipes()
  create(@Body() createOrganisationDto: CreateOrganisationDto) {
    return this.organisationsService.create(createOrganisationDto);
  }

  @Get(':page/:pageSize')
  findAll(@Param('page') page: number, @Param('pageSize') pageSize: number) {
    return this.organisationsService.findAll(+page, +pageSize);
  }

  @Get(':user_id/:page/:pageSize')
  findAllUsersOrgs(
    @Param('page') page: number,
    @Param('pageSize') pageSize: number,
    @Param('user_id') user_id: number,
  ) {
    return this.organisationsService.findAllUsersOrgs(+page, +pageSize, +user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organisationsService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes()
  update(@Param('id') id: string, @Body() updateOrganisationDto: UpdateOrganisationDto) {
    return this.organisationsService.update(+id, updateOrganisationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organisationsService.remove(+id);
  }
}
