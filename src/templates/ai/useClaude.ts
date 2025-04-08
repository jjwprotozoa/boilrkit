interface ClaudeOptions {
  model?: string;
  max_tokens_to_sample?: number;
  temperature?: number;
  stop_sequences?: string[];
}

export const useClaude = async (
  prompt: string,
  options: ClaudeOptions = {}
): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error(
      'Anthropic API key not found. Please add VITE_ANTHROPIC_API_KEY to your .env file.'
    );
    return null;
  }

  const defaultOptions: ClaudeOptions = {
    model: 'claude-2',
    max_tokens_to_sample: 100,
    temperature: 0.7
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    prompt: `Human: ${prompt}\n\nAssistant:`
  };

  try {
    const res = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestOptions)
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.completion?.trim() ?? null;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error using Claude:', err.message);
    return null;
  }
};
