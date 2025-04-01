const { OpenAIClient } = require("@azure/openai");  
      const { DefaultAzureCredential } = require("@azure/identity");  
        
      export async function main() {  
          const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];  
          const deploymentId = process.env["AZURE_OPENAI_DEPLOYMENT_ID"];  
          const searchEndpoint = process.env["AZURE_AI_SEARCH_ENDPOINT"];  
          const searchIndex = process.env["AZURE_AI_SEARCH_INDEX"];  
        
          if (!endpoint || !deploymentId || !searchEndpoint || !searchIndex) {  
              console.error("Please set the required environment variables.");  
              return;  
          }  
        
          const client = new OpenAIClient(endpoint, new DefaultAzureCredential());  
        
          const messages = [  
              { role: "user", content: "Qul medicação e para qual espécie deseja obter a dosagem?" }  
          ];  
          console.log(`Message: ${messages.map((m) => m.content).join("\n")}`);  
        
          const events = await client.streamChatCompletions(deploymentId, messages, {  
              pastMessages: 10,  
              maxTokens: 800,  
              temperature: 0.7,  
              topP: 0.95,  
              frequencyPenalty: 0,  
              presencePenalty: 0,  
              azureExtensionOptions: {  
                  extensions: [  
                      {  
                          type: "AzureCognitiveSearch",  
                          endpoint: searchEndpoint,  
                          indexName: searchIndex,  
                          // Assuming the SDK or service automatically uses the DefaultAzureCredential  
                          // for authentication to Azure Cognitive Search, no additional auth setup needed here.  
                      },  
                  ],  
              },  
          });  
        
          let response = "";  
          for await (const event of events) {  
              for (const choice of event.choices) {  
                  const newText = choice.delta?.content;  
                  if (!!newText) {  
                      response += newText;  
                      // To see streaming results as they arrive, uncomment line below  
                      // console.log(newText);  
                  }  
              }  
          }  
          console.log(response);  
      }  
        
      main().catch((err) => {  
          console.error("The sample encountered an error:", err);  
      });