import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

function generateRandomDate(date: Date) {
  const now = new Date(date);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 100);

  const randomTimestamp = now.getTime() + Math.random() * (endOfDay.getTime() - now.getTime());
  const randomDate = new Date(randomTimestamp);

  return randomDate;
}

export const runtime = 'experimental-edge';

export default async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { date, messageText, messageId, account } = await req.json();

  const system = {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: `
      You are an email system that generate short random email message on provided text
      You need to discuss on some random work topics.
      Please resond back with a short message.
      Please respond back just with a reply message without any additional text`,
  };
  const user = {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: `Please respond to this text: ${messageText}`,
  };

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [system, user],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onCompletion: async (completion: string) => {
      await fetch(`${process.env.EMAIL_ENGINE_URL}account/${account}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.EMAIL_ENGINE_TOKEN}` },
        body: JSON.stringify({
          reference: {
            message: messageId,
            inline: true,
            action: 'reply',
          },
          text: completion,
          sendAt: generateRandomDate(date),
        }),
      });
    },
  });
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
