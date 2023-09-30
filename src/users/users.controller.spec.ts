import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    findAll: jest.fn((page, pageSize) => ({
      users: [
        {
          name: 'some',
          email: 'some',
          id: 1,
        },
      ],
      page,
      pageSize,
      count: 1,
    })),
    findOne: jest.fn((id) => ({
      name: 'some',
      email: 'some',
      id,
    })),
    remove: jest.fn((id) => ({
      name: 'some',
      email: 'some',
      id,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', () => {
      const crateUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@gmail',
        password: 'password',
      };

      expect(controller.create(crateUserDto)).toEqual({
        id: expect.any(Number),
        name: 'test',
        email: 'test@gmail',
        password: 'password',
      });

      expect(mockUserService.create).toBeCalledWith(crateUserDto);
    });
  });
  describe('patch', () => {
    it('should upate and return a user', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'test',
        email: 'test@gmail',
        password: 'password',
      };

      expect(controller.update('1', updateUserDto)).toEqual({
        id: expect.any(Number),
        name: 'test',
        email: 'test@gmail',
        password: 'password',
      });

      expect(mockUserService.update).toBeCalledWith(1, updateUserDto);
    });
  });
  describe('findAll', () => {
    it('should return users paginated', () => {
      expect(controller.findAll(1, 25)).toEqual({
        users: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
          }),
        ]),
        page: 1,
        pageSize: 25,
        count: expect.any(Number),
      });

      expect(mockUserService.findAll).toBeCalledWith(1, 25);
    });
  });
  describe('findOne', () => {
    it('should return one user', () => {
      const expectedResult = { id: 1, name: 'some', email: 'some' };

      const result = controller.findOne('1');

      expect(result).toEqual(expectedResult);
      expect(mockUserService.findOne).toBeCalledWith(1);
    });
  });
  describe('remove', () => {
    it('should return one user', () => {
      const expectedResult = { id: 1, name: 'some', email: 'some' };

      const result = controller.remove('1');

      expect(result).toEqual(expectedResult);
      expect(mockUserService.remove).toBeCalledWith(1);
    });
  });
});
