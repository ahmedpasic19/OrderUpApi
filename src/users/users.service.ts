import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const uniqueEmail = await prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (uniqueEmail) {
      return { message: `User with that email already exists.` };
    }

    const newUser = await prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });

    return newUser;
  }

  async findAll(page: number, pageSize: number) {
    const users = await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const count = await prisma.user.count();

    return { users, page, pageSize, count };
  }

  async findOne(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return { message: `User with ID ${id} not found.` };
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return { message: `User with ID ${id} not found.` };
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: updateUserDto.email,
        password: updateUserDto.password,
      },
    });

    return updatedUser;
  }

  async remove(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return { message: `User with ID ${id} not found.` };
    }

    const removedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    return removedUser;
  }
}
