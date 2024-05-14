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
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });
  
  describe('create Admin controller', () => {
    it('create Admin resolve', () => {
      jest.spyOn(service, 'create').mockResolvedValue(admin);
      const result = controller.create({} as any);
      expect(result).resolves.toEqual(admin);
    });

    it('create Admin reject ', () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue('This Email Has Been used before');
      const result = controller.create({} as any);
      expect(result).rejects.toEqual('This Email Has Been used before');
    });
  });
});
