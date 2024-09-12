import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role_Key } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string>(
      Role_Key,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRole) {
      // No permissions required, allow access
      return true;
    }
    console.log(requiredRole);
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }
    console.log(requiredRole)
    return user.type == requiredRole
  }
}
