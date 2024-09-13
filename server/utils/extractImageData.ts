import OpenAI from "openai";
import { promises as fs } from 'fs';
import path from 'path';

export async function useExtractImageData( path: string ) { 
    const openai = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY
    });

    const imagePath = './server/routes/api/ruby-coffee-roasters/images/test-image.webp';

    const imageBuffer = await fs.readFile(imagePath);

    try {
        const imageBuffer = await fs.readFile(imagePath);
        const imageBase64 = imageBuffer.toString('base64');

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: "user",
                    content: [
                        { 
                            type: "text",
                            text: `Extract the following information:
                            - What are the flavor notes of this coffee?
                            - What is the process of this coffee?
                            - What country is the coffee from?
                            - What variety is the coffee?
                            
                            Return the information in the following format:
                            {
                                flavor_notes: [],
                                process: '',
                                country: '',
                                variety: ''
                            }

                            If the information is not available, feel free to return an empty string or array.`
                        },
                        {
                            type: "image_url",
                            image_url: `data:image/webp;base64,${imageBase64}`,
                            detail: "auto"
                        }
                    ]
                }
            ]
        });

        return response.choices[0];
    } catch (error) {
        // Handle errors (e.g., file not found)
        return error;
    }
}