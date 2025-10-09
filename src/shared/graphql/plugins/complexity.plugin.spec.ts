import { ComplexityPlugin } from './complexity.plugin';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import * as queryComplexity from 'graphql-query-complexity';

jest.mock('graphql-query-complexity', () => ({
  getComplexity: jest.fn(),
  fieldExtensionsEstimator: jest.fn(),
  simpleEstimator: jest.fn(),
}));

describe('ComplexityPlugin', () => {
  let plugin: ComplexityPlugin;
  let schemaHost: GraphQLSchemaHost;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    schemaHost = {
      schema: {} as any,
    } as GraphQLSchemaHost;

    plugin = new ComplexityPlugin(schemaHost);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('requestDidStart', () => {
    it('should allow queries below complexity limit', async () => {
      (queryComplexity.getComplexity as jest.Mock).mockReturnValue(20);

      const requestListener = await plugin.requestDidStart();
      const request = {
        operationName: 'TestQuery',
        variables: {},
      };
      const document = {} as any;

      await expect(
        requestListener.didResolveOperation?.({ request, document } as any)
      ).resolves.not.toThrow();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Query Complexity] TestQuery: 20/50'
      );
    });

    it('should reject queries exceeding complexity limit', async () => {
      (queryComplexity.getComplexity as jest.Mock).mockReturnValue(100);

      const requestListener = await plugin.requestDidStart();
      const request = {
        operationName: 'ExpensiveQuery',
        variables: {},
      };
      const document = {} as any;

      await expect(
        requestListener.didResolveOperation?.({ request, document } as any)
      ).rejects.toThrow(GraphQLError);

      await expect(
        requestListener.didResolveOperation?.({ request, document } as any)
      ).rejects.toThrow('Query is too complex: 100. Maximum allowed complexity: 50');

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should allow queries at exact complexity limit', async () => {
      (queryComplexity.getComplexity as jest.Mock).mockReturnValue(50);

      const requestListener = await plugin.requestDidStart();
      const request = {
        operationName: 'MaxQuery',
        variables: {},
      };
      const document = {} as any;

      await expect(
        requestListener.didResolveOperation?.({ request, document } as any)
      ).resolves.not.toThrow();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Query Complexity] MaxQuery: 50/50'
      );
    });

    it('should handle anonymous queries', async () => {
      (queryComplexity.getComplexity as jest.Mock).mockReturnValue(10);

      const requestListener = await plugin.requestDidStart();
      const request = {
        operationName: undefined,
        variables: {},
      };
      const document = {} as any;

      await expect(
        requestListener.didResolveOperation?.({ request, document } as any)
      ).resolves.not.toThrow();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Query Complexity] Anonymous: 10/50'
      );
    });

    it('should handle zero complexity queries', async () => {
      (queryComplexity.getComplexity as jest.Mock).mockReturnValue(0);

      const requestListener = await plugin.requestDidStart();
      const request = {
        operationName: 'IntrospectionQuery',
        variables: {},
      };
      const document = {} as any;

      await expect(
        requestListener.didResolveOperation?.({ request, document } as any)
      ).resolves.not.toThrow();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[Query Complexity] IntrospectionQuery: 0/50'
      );
    });
  });
});
