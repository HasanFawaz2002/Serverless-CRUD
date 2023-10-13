import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { connectToMongoDB } from "../../connection"; 
import Product from "../model";

const headers = {
  "content-type": "application/json",
}


export const getProductById = async (
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
  
      const product = await Product.findById(productId).exec();
  
      if (!product) {
        return formatJSONResponse({
          statusCode: 404,
          body: JSON.stringify({ error: "Product not found" }),
        });
      }
  
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(product),
      };
    } catch (error) {
      console.error("Error retrieving product by ID:", error);
  
      return formatJSONResponse({
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    }
  };