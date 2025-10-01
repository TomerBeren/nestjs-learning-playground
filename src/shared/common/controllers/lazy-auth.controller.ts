import { Controller, Get, Post, Body, OnModuleInit, Logger } from '@nestjs/common';

@Controller('lazy-auth')
export class LazyAuthController implements OnModuleInit {
  private readonly logger = new Logger(LazyAuthController.name);
  private authService: any = null;

  async onModuleInit() {
    this.logger.log('LazyAuthController initialized - Auth SERVICE will be loaded on demand');
    this.logger.log('⚠️  Note: This controller does NOT lazy load the AuthModule (which would violate NestJS rules)');
    this.logger.log('✅ Instead, it lazy loads only the AuthService classes directly');
  }

  private async loadAuthServiceIfNeeded() {
    if (this.authService) {
      return this.authService;
    }

    try {
      this.logger.log('🚀 Loading Auth SERVICE lazily (NOT the module)...');
      
      // ✅ SAFE: Only import service classes, NOT modules with controllers
      const authServiceExports = await import('../../../modules/auth/auth.service');
      const usersServiceExports = await import('../../../modules/users/users.service');
      
      const AuthServiceClass = authServiceExports.AuthService;
      const UsersServiceClass = usersServiceExports.UsersService;
      
      // Create service instances manually (not through module loading)
      const usersService = new UsersServiceClass();
      this.authService = new AuthServiceClass(usersService);
      
      this.logger.log('✅ Auth SERVICE loaded successfully (no controllers involved)');
      return this.authService;
      
    } catch (error) {
      this.logger.error('❌ Failed to load Auth service', error.stack);
      throw new Error('Auth service could not be loaded');
    }
  }

  @Post('login')
  async login(@Body() loginData: { username: string; password: string }) {
    const authService = await this.loadAuthServiceIfNeeded();
    
    this.logger.log(`🔐 Processing login for user: ${loginData.username} (via lazy-loaded auth)`);
    
    const result = authService.login(loginData.username, loginData.password);
    
    if (!result) {
      throw new Error('Invalid credentials');
    }
    
    return {
      message: 'Login successful via lazy-loaded auth module',
      ...result,
      loadedLazily: true,
    };
  }

  @Post('validate')
  async validateUser(@Body() loginData: { username: string; password: string }) {
    const authService = await this.loadAuthServiceIfNeeded();
    
    this.logger.log(`🔍 Validating user: ${loginData.username} (via lazy-loaded auth)`);
    
    const user = authService.validateUser(loginData.username, loginData.password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      message: 'User validation successful via lazy-loaded auth module',
      user,
      loadedLazily: true,
    };
  }

  @Get('profile')
  async getProfile() {
    const authService = await this.loadAuthServiceIfNeeded();
    
    this.logger.log('👤 Getting user profile (via lazy-loaded auth)');
    
    // Mock getting profile with fake token
    const user = authService.getUserByToken('fake-jwt-token');
    
    return {
      message: 'Profile retrieved via lazy-loaded auth module',
      user,
      loadedLazily: true,
    };
  }

  @Get('status')
  getStatus() {
    return {
      authModuleLoaded: this.authService !== null,
      message: this.authService 
        ? 'Auth module has been lazy-loaded' 
        : 'Auth module not yet loaded - will load on first auth operation',
      loadingStrategy: 'lazy',
    };
  }
}