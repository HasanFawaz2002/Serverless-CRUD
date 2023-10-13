import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.updateProductById`,
  events: [
    {
      http: {
        method: 'put',
        path: '/updateProductById/{id}',
        
      },
    },
  ],
};
