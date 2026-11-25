import { checkBotId } from 'botid/server';

export async function POST(request: Request) {
  try {
    const { isBot } = await checkBotId();
    if (isBot) {
      return Response.json({ error: 'Access denied' }, { status: 403 });
    }
  } catch {
    console.error('BotID verification failed for /api/sensitive');
    return Response.json({ error: 'Verification unavailable' }, { status: 503 });
  }

  try {
    await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  return Response.json({ data: { success: true } });
}
