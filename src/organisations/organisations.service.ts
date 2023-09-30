import { Injectable } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class OrganisationsService {
  async create(createOrganisationDto: CreateOrganisationDto) {
    const nowOrg = await prisma.organisation.create({
      data: {
        address: createOrganisationDto.address,
        name: createOrganisationDto.name,
        phone: createOrganisationDto.phone,
        city: createOrganisationDto.city,
        user_id: +createOrganisationDto.user_id,
      },
    });

    return { message: 'Organisation created', organisation: nowOrg };
  }

  async findAll(page: number, pageSize: number) {
    const orgs = await prisma.organisation.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return orgs;
  }

  async findAllUsersOrgs(page: number, pageSize: number, user_id: number) {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return { message: `User with ID ${user_id} was not found.` };
    }

    const orgs = await prisma.organisation.findMany({
      where: {
        user_id,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return orgs;
  }

  async findOne(id: number) {
    const org = await prisma.organisation.findUnique({
      where: {
        id,
      },
    });

    if (!org) {
      return { message: `Organisation with ID ${id} was not found.` };
    }

    return org;
  }

  async update(id: number, updateOrganisationDto: UpdateOrganisationDto) {
    const org = await prisma.organisation.findUnique({
      where: {
        id,
      },
    });

    if (!org) {
      return { message: `Organisation with ID ${id} was not found.` };
    }

    const updatedOrg = await prisma.organisation.update({
      where: {
        id,
      },
      data: {
        address: updateOrganisationDto.address,
        name: updateOrganisationDto.name,
        phone: updateOrganisationDto.phone,
        city: updateOrganisationDto.city,
        user_id: +updateOrganisationDto.user_id,
      },
    });

    return { message: 'Organisation updated', organisation: updatedOrg };
  }

  async remove(id: number) {
    const org = await prisma.organisation.findUnique({
      where: {
        id,
      },
    });

    if (!org) {
      return { message: `Organisation with ID ${id} was not found.` };
    }

    // remove all org products
    await prisma.product.deleteMany({
      where: {
        organisation_id: id,
      },
    });

    const deletedOrg = await prisma.organisation.delete({
      where: {
        id,
      },
    });

    return { message: 'Organisation successfully removed', organisation: deletedOrg };
  }
}
