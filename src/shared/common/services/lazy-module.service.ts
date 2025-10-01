import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LazyModuleService {
  private readonly logger = new Logger(LazyModuleService.name);
  private authService: any = null;

  async loadAuthService(): Promise<any> {
    if (this.authService) {
      this.logger.log('Auth service already loaded');
      return this.authService;
    }

    try {
      this.logger.log('Loading Auth service lazily...');
      
      // Dynamic import of required services
      const { AuthService } = await import('../../../modules/auth/auth.service');
      const { UsersService } = await import('../../../modules/users/users.service');
      
      // Create instances manually for lazy loading
      const usersService = new UsersService();
      this.authService = new AuthService(usersService);
      
      this.logger.log('Auth service loaded successfully');
      return this.authService;
      
    } catch (error) {
      this.logger.error('Failed to load Auth service', error.stack);
      throw error;
    }
  }

  isAuthServiceLoaded(): boolean {
    return this.authService !== null;
  }
}