import { OpenAIClient } from "@azure/openai";
import { DefaultAzureCredential } from "@azure/identity";

// You will need to set these environment variables or edit the following values
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];

// The prompt to generate images from
const prompt = "Ilustração de um cachorro da raça teckel, com óculos de sol e chupando uma manga, em um gramado verde de um parque";
// The size of the generated image
const size = "1024x1024";
// The number of images to generate
const n = 1;

async function main() {
    console.log("== Batch Image Generation ==");

    const credential = new DefaultAzureCredential();
    const client = new OpenAIClient(endpoint, credential);
    const deploymentName = "dall-e-3";
    const results = await client.getImages(deploymentName, prompt, { n, size });

    for (const image of results.data) {
        console.log('Image generation result URL: ' + image.url);
    }
}

main().catch((err) => {
    console.error("The sample encountered an error:", err);
});