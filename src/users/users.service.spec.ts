import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaClient;

  const mockUserService = {
    user: {
      create: jest.fn((dto) => ({ ...dto, id: 1 })),
      update: jest.fn((id, dto) => ({ ...dto, id })),
      remove: jest.fn((id) => ({ id, email: 'mail@mail', name: 'name', password: 'password' })),
      findUnique: jest.fn((id) => ({ id, email: 'mail@mail', name: 'name', password: 'password' })),
      findMany: jest.fn((page, pageSize) => ({
        users: [
          { id: 1, email: 'mail@mail', name: 'name', password: 'password' },
          { id: 2, email: 'mail2@mail', name: 'name2', password: 'password2' },
        ],
        page,
        pageSize,
        count: 100,
      })),
    },
    $disconnect: jest.fn(), // Mock the disconnect function
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaClient,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // email MUST be uniqueF
      const uniqueEmail = `test${Date.now()}@example.com`;

      const createUserDto = {
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      };

      const expectedUser = {
        id: 1,
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      };

      const spyCreate = jest.spyOn(service, 'create');

      // Mock the Prisma Client's create method
      mockUserService.user.create.mockResolvedValue(createUserDto);

      expect(await service.create(createUserDto)).toEqual({
        ...expectedUser,
        id: expect.any(Number),
      });

      // Verify that Prisma's create method was called with the correct input
      expect(spyCreate).toHaveBeenCalledWith({
        ...createUserDto,
      });
    });
    it('should return error when missing data', async () => {
      const createUserDto = {} as CreateUserDto;

      const expectedOutput = {
        message: 'Invalid request',
      };

      const spyCreate = jest.spyOn(service, 'create');

      // Mock the Prisma Client's create method
      mockUserService.user.create.mockResolvedValue(createUserDto);

      expect(await service.create(createUserDto)).toEqual({ ...expectedOutput });

      // Verify that Prisma's create method was called with the correct input
      expect(spyCreate).toHaveBeenCalledWith({
        ...createUserDto,
      });
    });
  });
  describe('Update', () => {
    it('should return error if user doesnt exist', async () => {
      const uniqueEmail = `test${Date.now()}@example.com`;
      const createUserDto = {
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      };

      mockUserService.user.create.mockResolvedValue(createUserDto);

      const uid = 1;

      const updateUserDto = {
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      };

      const expectedUser = {
        id: uid,
        name: 'John Doe',
        email: uniqueEmail,
        password: 'password123',
      };

      const spyCreate = jest.spyOn(service, 'update');

      // Mock the Prisma Client's update method
      mockUserService.user.update.mockResolvedValue(updateUserDto);

      expect(await service.update(uid, updateUserDto)).toEqual({ ...expectedUser });

      // Verify that Prisma's update method was called with the correct input
      expect(spyCreate).toHaveBeenCalledWith({
        ...updateUserDto,
      });
    });
  });
  describe('remove', () => {
    it('Should return error if user not found', async () => {
      await expect(service.remove(1)).rejects.toThrowError('User with ID 1 not found.');

      expect(mockUserService.user.remove).not.toBeCalled();
    });
  });
  describe('findOne', () => {
    it('Should return error if user doesnt exist', async () => {
      await expect(service.findOne(1)).rejects.toThrowError('User with ID 1 not found.');

      expect(mockUserService.user.findUnique).toBeCalledWith(1);
    });
  });
  describe('findAll', () => {
    it('Should return multiple users', async () => {
      const findAllSpy = jest.spyOn(service, 'findAll');

      mockUserService.user.findMany.mockReturnValue({
        users: [],
        page: 1,
        pageSize: 1,
        count: 100,
      });

      expect(await service.findAll(1, 25)).toEqual({
        users: expect.any(Array),
        page: 1,
        pageSize: 25,
        count: expect.any(Number),
      });
      expect(findAllSpy).toBeCalledWith(1, 25);
    });
  });
});
