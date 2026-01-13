import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Brak klucza API OpenAI', useLocal: true },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { message, context } = body;

    const systemPrompt = `
Jesteś inteligentnym asystentem w systemie notatek "MyNotes".
Twoim celem jest pomaganie użytkownikowi w zarządzaniu notatkami, dokumentami i zadaniami.

KONTEKST DANYCH (Podsumowanie):
- Notatki: ${context.notesCount} (Ostatnie: ${context.latestNotes})
- Załączniki: ${context.attachmentsCount}
- Zadania (oczekujące): ${context.pendingTodosCount}
- Nadchodzące wydarzenia: ${context.nextEvents}
- Dzisiejsza data: ${new Date().toISOString()}

ZASADY:
1. Odpowiadaj krótko i konkretnie.
2. Jeśli użytkownik pyta o coś, czego nie ma w kontekście, powiedz o tym.
3. Bądź pomocny i uprzejmy.
4. Możesz prowadzić swobodną rozmowę (chit-chat), jeśli użytkownik nie pyta o dane.
5. Jeśli użytkownik chce DODAĆ WYDARZENIE do kalendarza, zwróć odpowiedź w formacie JSON (bez bloków kodu markdown):
{
  "action": "add_event",
  "event": {
    "title": "Tytuł wydarzenia",
    "start_time": "ISO string daty i godziny",
    "end_time": "ISO string daty i godziny (opcjonalnie, domyślnie +1h)",
    "description": "Opis (opcjonalnie)"
  },
  "response": "Tekst odpowiedzi dla użytkownika (np. Dodałem wydarzenie...)"
}
6. W pozostałych przypadkach zwracaj po prostu tekst odpowiedzi (zwykły string lub JSON z polem "response").

Użytkownik napisał: "${message}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const generatedText = completion.choices[0].message.content;
    
    // Try to parse as JSON if it looks like JSON
    try {
        if (generatedText && (generatedText.trim().startsWith('{') || generatedText.includes('"action":'))) {
            const jsonResponse = JSON.parse(generatedText);
            return NextResponse.json(jsonResponse);
        }
    } catch (e) {
        // Not valid JSON, return as text
    }

    return NextResponse.json({ response: generatedText });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd API', details: error.message, useLocal: true },
      { status: 500 }
    );
  }
}
