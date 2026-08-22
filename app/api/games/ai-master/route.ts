import { NextRequest, NextResponse } from 'next/server';
import { getAISettings, generateAIResponse } from '@/lib/ai-provider';

interface AIRequestPayload {
  action: 'generate_card' | 'boss_banter' | 'race_announcer' | 'audit_summary';
  prompt?: string;
  gameState?: Record<string, any>;
  model?: string;
}

// Fallback heuristic card generator
const FALLBACK_CARDS = [
  {
    name: 'Redis Cache Surge',
    type: 'buff',
    cost: 3,
    value: 25,
    description: 'Instantly serves hot queries from in-memory RAM cache.',
    icon: '⚡',
    color: 'from-amber-500 to-rose-600',
  },
  {
    name: 'Zero-Day SQL Injection',
    type: 'attack',
    cost: 5,
    value: 36,
    description: 'Exploits unescaped input to wipe production indexes.',
    icon: '💉',
    color: 'from-red-600 to-purple-800',
  },
  {
    name: 'Kubernetes Pod Auto-Heal',
    type: 'defense',
    cost: 4,
    value: 28,
    description: 'Spawns replica nodes and absorbs incoming traffic.',
    icon: '🛡️',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Unminified 100MB Bundle',
    type: 'attack',
    cost: 6,
    value: 48,
    description: 'Bloats the client thread with 300 unused npm packages.',
    icon: '💥',
    color: 'from-pink-600 to-rose-700',
  },
];

export async function POST(req: NextRequest) {
  try {
    const body: AIRequestPayload = await req.json();
    const { action, prompt, gameState } = body;

    const config = await getAISettings();
    const activeModel = config.groqModel || 'qwen/qwen3.6-27b';

    // 1. ACTION: GENERATE CUSTOM INFRASTRUCTURE CARD (Groq Qwen 3.6 / Llama)
    if (action === 'generate_card') {
      const userPrompt = prompt || 'Unexpected memory spike in production';

      try {
        const systemInstruction =
          'You are a game designer for a 1v1 developer infrastructure card game. Given a user theme, return ONLY a JSON object with: { "name": string, "type": "attack" | "defense" | "buff", "cost": integer 1 to 6, "value": integer 15 to 50, "description": string (max 12 words), "icon": single emoji, "color": tailwind gradient like "from-purple-600 to-indigo-600" } without markdown tags.';

        const aiResponse = await generateAIResponse({
          prompt: `Create a game card for: ${userPrompt}`,
          systemInstruction,
          temperature: 0.7,
          maxTokens: 160,
          overrideProvider: config.groqApiKey ? 'groq' : undefined,
        });

        if (aiResponse.text) {
          const cleanText = aiResponse.text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          return NextResponse.json({
            success: true,
            provider: aiResponse.provider,
            model: aiResponse.model || activeModel,
            card: {
              id: `card_${Date.now()}`,
              ...parsed,
            },
          });
        }
      } catch (e) {
        console.warn('[ai-master] Card gen AI failed, using fallback card generator');
      }

      // Fallback Card
      const fallback = FALLBACK_CARDS[Math.floor(Math.random() * FALLBACK_CARDS.length)];
      return NextResponse.json({
        success: true,
        provider: 'fallback',
        card: {
          ...fallback,
          id: `card_${Date.now()}`,
          name: prompt ? `${prompt.slice(0, 20)} Patch` : fallback.name,
        },
      });
    }

    // 2. ACTION: SITH LORD LIVE BANTER (Groq Qwen 3.6 / Llama)
    if (action === 'boss_banter') {
      const p1Hp = gameState?.p1Hp ?? 100;
      const p2Hp = gameState?.p2Hp ?? 100;
      const clashes = gameState?.clashes ?? 0;

      try {
        const aiResponse = await generateAIResponse({
          prompt: `Match status: Jedi HP: ${p1Hp}%, Sith HP: ${p2Hp}%, Blade Clashes: ${clashes}. Taunt the player!`,
          systemInstruction:
            'You are an intimidating Sith Lord Architect in a cyberpunk lightsaber duel. Respond with ONE punchy, arrogant, funny 1-sentence combat line (max 15 words) mixing Star Wars Sith attitude with software engineering humor (e.g., servers, memory leaks, slow latency, uptime). No quotes, no markdown.',
          temperature: 0.85,
          maxTokens: 50,
          overrideProvider: config.groqApiKey ? 'groq' : undefined,
        });

        if (aiResponse.text) {
          return NextResponse.json({
            success: true,
            provider: aiResponse.provider,
            model: aiResponse.model || activeModel,
            banter: aiResponse.text.trim(),
          });
        }
      } catch (e) {}

      // Fallback banter lines
      const defaultBanter = [
        'Your latency is as fragile as unindexed queries, Jedi!',
        'You cannot parry the full power of a distributed DDoS storm!',
        'Your uptime falters before the Dark Side of unhandled exceptions!',
        'Is that the best throughput your lightsaber can compile?',
        'Feel the raw energy of an infinite memory leak!',
      ];
      return NextResponse.json({
        success: true,
        provider: 'fallback',
        banter: defaultBanter[Math.floor(Math.random() * defaultBanter.length)],
      });
    }

    // 3. ACTION: REAL-TIME RACE ANNOUNCER
    if (action === 'race_announcer') {
      const leader = gameState?.leader || 'Player 1';
      const lap = gameState?.lap || 1;

      try {
        const aiResponse = await generateAIResponse({
          prompt: `${leader} is pushing through Lap ${lap} with hyper Nitro active!`,
          systemInstruction:
            'You are an energetic Formula 1 cyber esports announcer. Give ONE hyper-fast, thrilling 1-sentence live racing shoutout (max 14 words).',
          temperature: 0.8,
          maxTokens: 40,
          overrideProvider: config.groqApiKey ? 'groq' : undefined,
        });

        if (aiResponse.text) {
          return NextResponse.json({
            success: true,
            provider: aiResponse.provider,
            model: aiResponse.model || activeModel,
            commentary: aiResponse.text.trim(),
          });
        }
      } catch (e) {}

      const defaultCommentary = [
        '⚡ Massive Nitro surge across the neon chicane!',
        '🔥 Unbelievable drift around the server firewall corner!',
        '🏁 Battle for 1st position heats up on the final stretch!',
        '🚀 Slipstream engaged! Speeds exceeding 220 KM/H!',
      ];
      return NextResponse.json({
        success: true,
        provider: 'fallback',
        commentary: defaultCommentary[Math.floor(Math.random() * defaultCommentary.length)],
      });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error: any) {
    console.error('AI Game Master Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 });
  }
}
