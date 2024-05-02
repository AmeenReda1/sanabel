import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      // No permissions required, allow access
      return true;
    }
    console.log(requiredPermission);
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }
    console.log(user.role.permission);
    const permissionArr = user.role.permission;
    const userPermission: string[] = [];
    permissionArr.forEach((permissionObj) => {
      userPermission.push(permissionObj.permission_name);
    });
    // Check if user has required permissions
    const hasPermission = userPermission.includes(requiredPermission);
    return hasPermission;
  }
}
