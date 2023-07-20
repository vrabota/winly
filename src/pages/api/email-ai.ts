import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

import { baseUrl } from '@utils/baseUrl';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

function generateRandomDate() {
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 100);

  const randomTimestamp = now.getTime() + Math.random() * (endOfDay.getTime() - now.getTime());
  const randomDate = new Date(randomTimestamp);

  return randomDate;
}

export const runtime = 'experimental-edge';

export default async function handler(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages, from, to, organizationId } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages.map((message: any) => ({
      content: message.content,
      role: message.role,
    })),
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    onCompletion: async (completion: string) => {
      const parsedData = JSON.parse(completion);
      const response = await fetch(`${process.env.EMAIL_ENGINE_URL}account/${from.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.EMAIL_ENGINE_TOKEN}` },
        body: JSON.stringify({
          subject: `${parsedData.subject} | ${from.code}-${to.code}`,
          text: `${parsedData.body} \n\n ${from.code}-${to.code}`,
          to: [
            {
              name: `${to['first_name']} ${to['last_name']}`,
              address: to['email'],
            },
          ],
          sendAt: generateRandomDate(),
        }),
      });
      const data = await response.json();
      await fetch(`${baseUrl}/api/create-warmup-activity?key=${process.env.VERCEL_CRON_SECRET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queueId: data.queueId,
          messageId: data.messageId,
          accountId: from.id,
          recipientEmail: to['email'],
          organizationId,
        }),
      });
      // We can call here send email API to create queue message in emailengine
    },
  });
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
