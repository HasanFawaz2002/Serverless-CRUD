import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { connectToMongoDB } from "../../connection"; 
import Product from "../model";

const headers = {
  "content-type": "application/json",
}


export const deleteProductById = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    try {
      const isConnected = await connectToMongoDB();
  
      if (!isConnected) {
        return formatJSONResponse({
          statusCode: 500,
          body: JSON.stringify({ error: "Failed to connect to MongoDB" }),
        });
      }
  
      const productId = event.pathParameters?.id; 
  
      if (!productId) {
        return formatJSONResponse({
          statusCode: 400,
          body: JSON.stringify({ error: "Product ID is missing in the path" }),
        });
      }
  
      const deletedProduct = await Product.findByIdAndRemove(productId).exec();
  
      if (!deletedProduct) {
        return formatJSONResponse({
          statusCode: 404,
          body: JSON.stringify({ error: "Product not found" }),
        });
      }
  
      return {
        statusCode: 204, 
        headers,
        body: JSON.stringify({message:"Product deleted successfully"})
      };
    } catch (error) {
      console.error("Error deleting product by ID:", error);
  
      return formatJSONResponse({
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    }
  };