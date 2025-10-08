import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import graphqlConfig from '../../config/graphql.config';

@Module({
  imports: [
    ConfigModule.forFeature(graphqlConfig),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(
          process.cwd(),
          configService.get<string>('graphql.autoSchemaFile', 'src/schema.gql')
        ),
        sortSchema: configService.get<boolean>('graphql.sortSchema', true),
        playground: configService.get<boolean>('graphql.playground', true),
        debug: configService.get<boolean>('graphql.debug', true),
        introspection: configService.get<boolean>('graphql.introspection', true),
      }),
    }),
  ],
})
export class GraphqlConfigModule {}
