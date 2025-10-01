import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

export interface LazyModuleOptions {
  modulePath: string;
  serviceName: string;
}

@Module({})
export class LazyModule {
  static forRootAsync(options: LazyModuleOptions): DynamicModule {
    const lazyProvider: Provider = {
      provide: `LAZY_${options.serviceName}`,
      useFactory: async (moduleRef: ModuleRef) => {
        // This is where the actual lazy loading happens
        const moduleExports = await import(options.modulePath);
        const ModuleClass = moduleExports[Object.keys(moduleExports)[0]];
        
        // Create the module instance
        const moduleInstance = await moduleRef.create(ModuleClass);
        return moduleInstance.get(options.serviceName);
      },
      inject: [ModuleRef],
    };

    return {
      module: LazyModule,
      providers: [lazyProvider],
      exports: [lazyProvider],
      global: true,
    };
  }
}