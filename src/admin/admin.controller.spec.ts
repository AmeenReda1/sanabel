import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.enitity';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;
  const admin = {
    name: '',
  } as Admin;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            createAdmin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });
  describe('create Admin controller', () => {
    it('create Admin resolve', () => {
      jest.spyOn(service, 'createAdmin').mockResolvedValue(admin);
      const result = controller.createAdmin({} as any);
      expect(result).resolves.toEqual(admin);
    });
    it('create Admin reject ', () => {
      jest
        .spyOn(service, 'createAdmin')
        .mockRejectedValue('This Email Has Been used before');
      const result = controller.createAdmin({} as any);
      expect(result).rejects.toEqual('This Email Has Been used before');
    });
  });
//   describe(' Admin Login controller', () => {
//     it('Admin login resolve ', async () => {
//       //   const authenticatedUser = { id: 1, username: 'admin', role: 'admin' };

//       // Mocking the request object with user property
//       //   const req = { user: authenticatedUser };

//       // Call the login function with mocked request object
//       const result = await controller.login({} as any);

//       // Assert that the result is the authenticated user
//       expect(result).toEqual({} as any);
//     });
//     it.skip('Admin Login reject ', () => {
//       jest
//         .spyOn(service, 'createAdmin')
//         .mockRejectedValue('This Email Has Been used before');
//       const result = controller.login({} as any);
//       expect(result).rejects.toEqual('This Email Has Been used before');
//     });
//   });
});
