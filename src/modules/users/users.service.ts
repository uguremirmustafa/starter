// src/modules/users/users.service.ts
import { prisma } from '../../lib/prisma';
import { NotFoundError, ForbiddenError } from '../../lib/errors';
import { JwtPayload } from '../../types';

export class UserService {
  async findAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async updateProfile(
    targetId: string,
    caller: JwtPayload,
    data: { name?: string; avatarUrl?: string },
  ) {
    // Users can only update themselves; admins can update anyone
    if (caller.sub !== targetId && caller.role !== 'ADMIN') {
      throw new ForbiddenError('Cannot update another user');
    }
    await this.findById(targetId); // ensure exists
    return prisma.user.update({
      where: { id: targetId },
      data,
      select: { id: true, email: true, name: true, avatarUrl: true, role: true, updatedAt: true },
    });
  }

  async deleteUser(targetId: string, caller: JwtPayload) {
    if (caller.sub !== targetId && caller.role !== 'ADMIN') {
      throw new ForbiddenError('Cannot delete another user');
    }
    await this.findById(targetId);
    await prisma.user.delete({ where: { id: targetId } });
  }
}

export const userService = new UserService();
