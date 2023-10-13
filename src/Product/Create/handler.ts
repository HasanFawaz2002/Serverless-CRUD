import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { connectToMongoDB } from "../../connection"; 
import Product from "../model";

const headers = {
  "content-type": "application/json",
}



interface ProductRequest {
  name: string;
  description: string;
  salary: number;
}


export const createProduct = async (
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
  
      if (!event.body) {
        return formatJSONResponse({
          statusCode: 400, 
          body: JSON.stringify({ error: "Request body is empty" }),
        });
      }
  
      let reqBody: ProductRequest;
  
      try {
        reqBody = JSON.parse(event.body);
      } catch (parseError) {
        return formatJSONResponse({
          statusCode: 400, 
          body: JSON.stringify({ error: "Invalid JSON in request body" }),
        });
      }
  
      const newProduct = new Product({
        name: reqBody.name,
        description: reqBody.description,
        salary: reqBody.salary,
      });
  
      const createdProduct = await newProduct.save();
  
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(createdProduct),
      };
    } catch (error) {
      console.error("Error creating product:", error);
  
      return formatJSONResponse({
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    }
  };
  