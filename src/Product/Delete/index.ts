import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.deleteProductById`,
  events: [
    {
      http: {
        method: 'delete',
        path: '/deleteProductById/{id}',
        
      },
    },
  ],
};
