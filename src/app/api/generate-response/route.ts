import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client, notes } = body;

    if (!client) {
      return NextResponse.json(
        { error: 'Brak danych klienta' },
        { status: 400 }
      );
    }

    const notesText = notes && notes.length > 0 
      ? notes.map((n: any) => `- ${n.content} (Autor: ${n.author}, Data: ${n.date})`).join('\n')
      : 'Brak notatek.';

    const prompt = `
Jesteś inteligentnym asystentem głosowym w kancelarii adwokackiej. Twoim zadaniem jest wygenerowanie naturalnej, mówionej wypowiedzi dla klienta, opierając się na historii notatek i statusie sprawy.

DANE KLIENTA:
Imię i nazwisko: ${client.full_name}
Email: ${client.email}
Telefon: ${client.phone}
Kontekst AI (stałe instrukcje): ${client.ai_context_note || 'Brak'}

HISTORIA NOTATEK (od najnowszych):
${notesText}

INSTRUKCJE DO GENEROWANIA ODPOWIEDZI:
1. Przeanalizuj ostatnie notatki, aby zrozumieć bieżącą sytuację (np. czy dokumenty dotarły, czy czekamy na sąd, czy jest wyznaczony termin).
2. Wygeneruj wypowiedź, którą asystent głosowy ma powiedzieć klientowi.
3. Jeśli w notatkach jest informacja, że "dokumenty zostały dostarczone" lub podobna, poinformuj klienta: "Potwierdzam, że otrzymaliśmy Pana/Pani dokumenty. Jesteśmy w trakcie ich analizy i wkrótce się skontaktujemy."
4. Jeśli w notatkach jest prośba o kontakt, powiedz o tym.
5. Styl ma być uprzejmy, profesjonalny, ale naturalny i konwersacyjny (nie jak e-mail).
6. Mów w pierwszej osobie liczby mnogiej ("my", "nasza kancelaria") lub jako asystent ("przekażę mecenasowi").
7. Nie dodawaj żadnych wstępów typu "Oto propozycja odpowiedzi:", tylko sam tekst do wypowiedzenia.
8. Absolutnie NIE dodawaj podpisu, imienia i nazwiska, stanowiska ani nazwy kancelarii na końcu wypowiedzi. Generuj wyłącznie treść wiadomości.

Twoja odpowiedź:
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Jesteś profesjonalnym asystentem głosowym w kancelarii prawnej. Twoje wypowiedzi są zwięzłe, konkretne i pomocne." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const generatedText = completion.choices[0].message.content;

    return NextResponse.json({ response: generatedText });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas generowania odpowiedzi.', details: error.message },
      { status: 500 }
    );
  }
}
