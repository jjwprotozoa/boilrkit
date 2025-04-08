interface GPTOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  stop?: string[];
}

export const useGPT = async (
  prompt: string,
  options: GPTOptions = {}
): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error(
      'OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file.'
    );
    return null;
  }

  const defaultOptions: GPTOptions = {
    model: 'gpt-3.5-turbo-instruct',
    max_tokens: 100,
    temperature: 0.7
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    prompt
  };

  try {
    const res = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestOptions)
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.choices?.[0]?.text?.trim() ?? null;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error using GPT:', err.message);
    return null;
  }
};
