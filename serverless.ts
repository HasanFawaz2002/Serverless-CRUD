import type { AWS } from '@serverless/typescript';

import createProduct from './src/Product/Create/index';
import deleteProductById from './src/Product/Delete/index';
import getAllProducts from './src/Product/GetAll/index';
import getProductById from './src/Product/GetById/index';
import updateProductById from './src/Product/Update/index';


const serverlessConfiguration: AWS = {
  service: 'serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  
  functions: { 
    createProduct,
    deleteProductById,
    getAllProducts,
    getProductById,
    updateProductById
    },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};


module.exports = serverlessConfiguration;
