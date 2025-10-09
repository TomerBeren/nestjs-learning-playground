import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import graphqlConfig from '../../config/graphql.config';
import { AuthModule } from '../../modules/auth/auth.module';
import { AuthService } from '../../modules/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forFeature(graphqlConfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService, AuthService],
      useFactory: async (configService: ConfigService, authService: AuthService) => ({
        autoSchemaFile: join(
          process.cwd(),
          configService.get<string>('graphql.autoSchemaFile', 'src/schema.gql')
        ),
        sortSchema: configService.get<boolean>('graphql.sortSchema', true),
        playground: configService.get<boolean>('graphql.playground', true),
        debug: configService.get<boolean>('graphql.debug', true),
        introspection: configService.get<boolean>('graphql.introspection', true),
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context: any) => {
              const { connectionParams, extra } = context;
              
              // Extract token from connection params
              const token = connectionParams?.authorization?.replace('Bearer ', '') || connectionParams?.authToken;
              
              if (token) {
                // Use your existing auth service to validate token and get user
                const user = await authService.getUserByToken(token);
                if (user) {
                  extra.user = user;
                }
              }
            },
          },
        },
        context: ({ req, extra }) => {
          // Access additional context through the extra field for subscriptions
          // For queries/mutations, use req
          return { req, ...extra };
        },
      }),
    }),
  ],
})
export class GraphqlConfigModule {}
