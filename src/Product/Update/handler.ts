import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { connectToMongoDB } from "../../connection"; 
import Product from "../model";

const headers = {
  "content-type": "application/json",
}

interface UpdateProductRequest {
    name?: string;
    description?: string;
    salary?: number;
  }


  export const updateProductById = async (
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
  
      if (!event.body) {
        return formatJSONResponse({
          statusCode: 400,
          body: JSON.stringify({ error: "Request body is empty" }),
        });
      }
  
      const reqBody: UpdateProductRequest = JSON.parse(event.body);
  
      const updatedProduct = await Product.findByIdAndUpdate(productId, reqBody, {
        new: true, 
      }).exec();
  
      if (!updatedProduct) {
        return formatJSONResponse({
          statusCode: 404,
          body: JSON.stringify({ error: "Product not found" }),
        });
      }
  
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedProduct),
      };
    } catch (error) {
      console.error("Error updating product by ID:", error);
  
      return formatJSONResponse({
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    }
  };