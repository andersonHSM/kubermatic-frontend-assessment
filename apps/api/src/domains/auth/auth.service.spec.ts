import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let users: jest.Mocked<UsersService>;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: { findOne: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn(), verifyAsync: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    users = module.get(UsersService) as any;
    jwt = module.get(JwtService) as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login should sign token when credentials are valid', async () => {
    users.findOne.mockResolvedValue({ email: 'a@b.com', password: 'pwd' } as any);
    jwt.signAsync.mockResolvedValue('token');
    const token = await service.login({ email: 'a@b.com', password: 'pwd' });
    expect(jwt.signAsync).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(token).toBe('token');
  });

  it('login should throw Unauthorized when user not found or password mismatch', async () => {
    users.findOne.mockResolvedValueOnce(null as any);
    await expect(service.login({ email: 'x', password: 'y' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    users.findOne.mockResolvedValueOnce({ email: 'a@b.com', password: 'pwd' } as any);
    await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('isAuthenticated should throw when no token provided', () => {
    expect(() => service.isAuthenticated(undefined)).toThrow(UnauthorizedException);
  });

  it('isAuthenticated should resolve when jwt verifies', async () => {
    jwt.verifyAsync.mockResolvedValue({ ok: true } as any);
    await expect(service.isAuthenticated('tkn')).resolves.toEqual({ ok: true });
    expect(jwt.verifyAsync).toHaveBeenCalledWith('tkn');
  });

  it('isAuthenticated should reject when jwt verify fails', async () => {
    jwt.verifyAsync.mockRejectedValue(new Error('bad'));
    await expect(service.isAuthenticated('tkn')).rejects.toBeTruthy();
  });
});
