import {  APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { connectToMongoDB } from "../../connection"; 
import Product from "../model";

const headers = {
  "content-type": "application/json",
}


export const getAllProducts = async (
 
    ): Promise<APIGatewayProxyResult> => {
      try {
        const isConnected = await connectToMongoDB();
    
        if (!isConnected) {
          return formatJSONResponse({
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to connect to MongoDB" }),
          });
        }
    
        const products = await Product.find().exec();
    
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(products),
        };
      } catch (error) {
        console.error("Error retrieving products:", error);
    
        return formatJSONResponse({
          statusCode: 500,
          body: JSON.stringify({ error: "Internal Server Error" }),
        });
      }
    };