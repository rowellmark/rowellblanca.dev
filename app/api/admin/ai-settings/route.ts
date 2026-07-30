import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAISettings, pingOllama, generateAIResponse } from '@/lib/ai-provider';

export async function GET() {
  try {
    const auth = await isAdminAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const config = await getAISettings();
    const ollamaStatus = await pingOllama(config.ollamaUrl);

    // Mask sensitive keys for client output
    const maskKey = (key?: string) => {
      if (!key) return '';
      if (key.length <= 8) return '••••••••';
      return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
    };

    return NextResponse.json({
      success: true,
      settings: {
        activeProvider: config.activeProvider,
        geminiApiKey: config.geminiApiKey ? maskKey(config.geminiApiKey) : '',
        geminiHasKey: Boolean(config.geminiApiKey),
        geminiModel: config.geminiModel,
        openaiApiKey: config.openaiApiKey ? maskKey(config.openaiApiKey) : '',
        openaiHasKey: Boolean(config.openaiApiKey),
        openaiModel: config.openaiModel,
        claudeApiKey: config.claudeApiKey ? maskKey(config.claudeApiKey) : '',
        claudeHasKey: Boolean(config.claudeApiKey),
        claudeModel: config.claudeModel,
        ollamaUrl: config.ollamaUrl,
        ollamaModel: config.ollamaModel,
        groqApiKey: config.groqApiKey ? maskKey(config.groqApiKey) : '',
        groqHasKey: Boolean(config.groqApiKey),
        groqModel: config.groqModel,
        noAiMode: Boolean(config.noAiMode),
      },
      ollamaStatus,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await isAdminAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      activeProvider,
      geminiApiKey,
      geminiModel,
      openaiApiKey,
      openaiModel,
      claudeApiKey,
      claudeModel,
      ollamaUrl,
      ollamaModel,
      groqApiKey,
      groqModel,
      noAiMode,
    } = body;

    const upsertSetting = async (key: string, value: string) => {
      if (value === undefined || value === null) return;
      await (prisma as any).setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    };

    if (activeProvider) await upsertSetting('active_ai_provider', activeProvider);
    if (geminiApiKey !== undefined && !geminiApiKey.includes('••••')) await upsertSetting('gemini_api_key', geminiApiKey);
    if (geminiModel) await upsertSetting('gemini_model', geminiModel);
    if (openaiApiKey !== undefined && !openaiApiKey.includes('••••')) await upsertSetting('openai_api_key', openaiApiKey);
    if (openaiModel) await upsertSetting('openai_model', openaiModel);
    if (claudeApiKey !== undefined && !claudeApiKey.includes('••••')) await upsertSetting('claude_api_key', claudeApiKey);
    if (claudeModel) await upsertSetting('claude_model', claudeModel);
    if (ollamaUrl) await upsertSetting('ollama_url', ollamaUrl);
    if (ollamaModel) await upsertSetting('ollama_model', ollamaModel);
    if (groqApiKey !== undefined && !groqApiKey.includes('••••')) await upsertSetting('groq_api_key', groqApiKey);
    if (groqModel) await upsertSetting('groq_model', groqModel);
    if (noAiMode !== undefined) await upsertSetting('no_ai_mode', String(Boolean(noAiMode)));

    return NextResponse.json({ success: true, message: 'AI settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await isAdminAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, provider } = await request.json();
    const testPrompt = prompt || 'Say hello and briefly introduce yourself as Rowell Blanca\'s AI Assistant.';

    const result = await generateAIResponse({
      prompt: testPrompt,
      overrideProvider: provider,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
