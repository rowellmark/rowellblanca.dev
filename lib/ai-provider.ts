import { prisma } from '@/lib/prisma';

export interface AIProviderConfig {
  activeProvider: 'gemini' | 'openai' | 'claude' | 'ollama';
  geminiApiKey?: string;
  geminiModel?: string;
  openaiApiKey?: string;
  openaiModel?: string;
  claudeApiKey?: string;
  claudeModel?: string;
  ollamaUrl?: string;
  ollamaModel?: string;
}

export async function getAISettings(): Promise<AIProviderConfig> {
  const config: AIProviderConfig = {
    activeProvider: (process.env.ACTIVE_AI_PROVIDER as any) || 'gemini',
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    claudeApiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || '',
    claudeModel: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
    ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3',
  };

  try {
    const rows = await (prisma as any).setting.findMany();
    if (Array.isArray(rows)) {
      const map = new Map(rows.map((s: { key: string; value: string }) => [s.key, s.value]));
      if (map.get('active_ai_provider')) config.activeProvider = map.get('active_ai_provider') as any;
      if (map.get('gemini_api_key')) config.geminiApiKey = map.get('gemini_api_key');
      if (map.get('gemini_model')) config.geminiModel = map.get('gemini_model');
      if (map.get('openai_api_key')) config.openaiApiKey = map.get('openai_api_key');
      if (map.get('openai_model')) config.openaiModel = map.get('openai_model');
      if (map.get('claude_api_key')) config.claudeApiKey = map.get('claude_api_key');
      if (map.get('claude_model')) config.claudeModel = map.get('claude_model');
      if (map.get('ollama_url')) config.ollamaUrl = map.get('ollama_url');
      if (map.get('ollama_model')) config.ollamaModel = map.get('ollama_model');
    }
  } catch (e) {
    console.warn('[getAISettings] DB settings lookup fallback to env defaults');
  }

  return config;
}

export async function pingOllama(url?: string): Promise<{ online: boolean; models: string[]; message: string }> {
  const targetUrl = (url || 'http://localhost:11434').replace(/\/$/, '');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${targetUrl}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const models = Array.isArray(data?.models) ? data.models.map((m: any) => m.name) : [];
      return {
        online: true,
        models,
        message: `Ollama local engine is ONLINE (${models.length} models installed: ${models.join(', ') || 'none'})`,
      };
    }
  } catch (e: any) {
    // Offline or unreachable
  }
  return {
    online: false,
    models: [],
    message: `Ollama is offline or unreachable at ${targetUrl}`,
  };
}

export async function generateAIResponse(options: {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  overrideProvider?: 'gemini' | 'openai' | 'claude' | 'ollama';
}): Promise<{ text: string; provider: string; model: string }> {
  const config = await getAISettings();
  const provider = options.overrideProvider || config.activeProvider || 'gemini';
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 1000;

  const fullPrompt = options.systemInstruction
    ? `${options.systemInstruction}\n\n${options.prompt}`
    : options.prompt;

  // 1. OLLAMA (LOCAL OR REMOTE)
  if (provider === 'ollama') {
    const ollamaUrl = (config.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
    const model = config.ollamaModel || 'llama3';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          prompt: fullPrompt,
          stream: false,
          options: { temperature, num_predict: maxTokens },
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data?.response) {
          return { text: data.response.trim(), provider: 'ollama', model };
        }
      }
    } catch (e) {
      console.warn('[AIProvider] Ollama request failed, falling back to Gemini...');
    }
  }

  // 2. OPENAI GPT
  if (provider === 'openai') {
    const apiKey = config.openaiApiKey;
    const model = config.openaiModel || 'gpt-4o-mini';

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            messages: [
              ...(options.systemInstruction ? [{ role: 'system', content: options.systemInstruction }] : []),
              { role: 'user', content: options.prompt },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) {
            return { text: reply.trim(), provider: 'openai', model };
          }
        }
      } catch (e) {
        console.warn('[AIProvider] OpenAI request failed, falling back to Gemini...');
      }
    }
  }

  // 3. ANTHROPIC CLAUDE
  if (provider === 'claude') {
    const apiKey = config.claudeApiKey;
    const model = config.claudeModel || 'claude-3-5-sonnet-20241022';

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            max_tokens: maxTokens,
            temperature,
            system: options.systemInstruction || undefined,
            messages: [{ role: 'user', content: options.prompt }],
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const reply = data?.content?.[0]?.text;
          if (reply) {
            return { text: reply.trim(), provider: 'claude', model };
          }
        }
      } catch (e) {
        console.warn('[AIProvider] Claude request failed, falling back to Gemini...');
      }
    }
  }

  // 4. GOOGLE GEMINI (DEFAULT / PRIMARY FALLBACK)
  const geminiApiKey = config.geminiApiKey;
  const geminiModel = config.geminiModel || 'gemini-2.5-flash';

  if (geminiApiKey) {
    const modelUrls = [
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
    ];

    for (const url of modelUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { temperature, maxOutputTokens: maxTokens },
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return { text: reply.trim(), provider: 'gemini', model: geminiModel };
          }
        }
      } catch (e) {
        // Continue to next model URL
      }
    }
  }

  // Final static response if no AI keys/models return a response
  return {
    text: `Rowell Mark Blanca is a Senior Full-Stack Engineer & Architect specializing in React, Next.js, and Custom WordPress. Feel free to book a discovery call or send a direct inquiry!`,
    provider: 'fallback',
    model: 'static',
  };
}
