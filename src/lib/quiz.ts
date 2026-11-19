type Opt = { text: string; isCorrect: boolean };
export type Question =
  | { type: "multiple" | "tf"; typeText: string; songInfo: string; videoId: string; question: string; options: Opt[]; rationale: string }
  | { type: "completion"; typeText: string; songInfo: string; videoId: string; question: string; correctAnswer: string; rationale: string };

const MC = "Múltipla Escolha", TF = "Verdadeiro ou Falso", FILL = "Preenchimento de Lacuna";
const tf = (v: boolean): Opt[] => [{ text: "Verdadeiro", isCorrect: v }, { text: "Falso", isCorrect: !v }];

export const QUESTIONS: Question[] = [
  { type: "multiple", typeText: MC, songInfo: "U2 - I Still Haven't Found What I'm Looking For", videoId: "e3-5YC_oHjE",
    question: 'No trecho "I still haven\'t found what I\'m looking for", qual é a principal função gramatical do Present Perfect?',
    options: [
      { text: "Descrever uma ação que ocorreu em um momento específico do passado.", isCorrect: false },
      { text: "Expressar uma busca iniciada no passado que continua relevante no presente.", isCorrect: true },
      { text: "Indicar uma ação futura programada para amanhã.", isCorrect: false },
      { text: "Falar de um hábito repetitivo do passado que já foi abandonado.", isCorrect: false },
    ], rationale: "O Present Perfect conecta uma ação do passado ao momento presente." },
  { type: "tf", typeText: TF, songInfo: "Queen - We Are the Champions", videoId: "04854XqcfCY",
    question: 'Na frase "I\'ve paid my dues, time after time", a contração "I\'ve" significa "I have", estruturando perfeitamente o Present Perfect.',
    options: tf(true), rationale: '"I\'ve" é a contração padrão de "I have", acompanhada do particípio passado do verbo pay (paid).' },
  { type: "completion", typeText: FILL, songInfo: "Creedence Clearwater Revival - Have You Ever Seen the Rain?", videoId: "Gu2pVPWGYMQ",
    question: 'Complete a pergunta clássica com o auxiliar correto: "_______ you ever seen the rain?"',
    correctAnswer: "have", rationale: 'Em perguntas com o sujeito "you", o auxiliar do Present Perfect no início da frase é "Have".' },
  { type: "multiple", typeText: MC, songInfo: "Adele - Someone Like You", videoId: "hLQl3WQQoQ0",
    question: 'No verso "I heard that you\'ve settled down", o uso de "you\'ve settled" indica:',
    options: [
      { text: "Uma ação concluída recentemente cujos efeitos ou notícias impactam o presente.", isCorrect: true },
      { text: "Uma ação que acontecerá na próxima semana.", isCorrect: false },
      { text: "Um fato científico generalizado.", isCorrect: false },
      { text: "Uma ordem dada no imperativo.", isCorrect: false },
    ], rationale: "Adele usa o Present Perfect para relatar uma mudança recente que ela acabou de descobrir." },
  { type: "tf", typeText: TF, songInfo: "Bon Jovi - Always", videoId: "9BMwcO6_hyA",
    question: 'A frase "I\'ve loved you, always" está incorreta pois o verbo "love" não pode ser usado com auxiliares de tempo perfeito.',
    options: tf(false), rationale: 'Falso! Verbos de estado como "love" aparecem no Present Perfect para sentimentos contínuos.' },
  { type: "multiple", typeText: MC, songInfo: "The Beatles - In My Life", videoId: "YBcdt6DsLQA",
    question: 'Se uma música diz "I have loved them all", qual elemento gramatical compõe a estrutura do Present Perfect?',
    options: [
      { text: "Apenas o passado simples do verbo principal.", isCorrect: false },
      { text: "O verbo auxiliar have/has acompanhado do verbo principal no particípio passado.", isCorrect: true },
      { text: "O verbo to be no passado mais gerúndio (-ing).", isCorrect: false },
      { text: "O verbo auxiliar do/does no presente.", isCorrect: false },
    ], rationale: "A estrutura é sempre sujeito + have/has + particípio passado." },
  { type: "completion", typeText: FILL, songInfo: "Bryan Adams - Heaven", videoId: "3eT464L1YRA",
    question: 'Complete o trecho da música com o particípio correto do verbo be: "Baby, you _______ all that I want."',
    correctAnswer: "have been", rationale: 'Para indicar estado contínuo até o presente, usa-se "have been".' },
  { type: "multiple", typeText: MC, songInfo: "The Cranberries - Zombie", videoId: "6Ejga4kJUts",
    question: "Qual palavra é frequentemente associada a perguntas sobre experiências de vida no Present Perfect?",
    options: [
      { text: "Yesterday", isCorrect: false }, { text: "Ever", isCorrect: true },
      { text: "Tomorrow", isCorrect: false }, { text: "Last year", isCorrect: false },
    ], rationale: '"Ever" (alguma vez na vida) é um marcador clássico de perguntas em tempos perfeitos.' },
  { type: "tf", typeText: TF, songInfo: "Coldplay - Fix You", videoId: "k4V3Mo61fJM",
    question: "O Present Perfect é idêntico ao Simple Past e ambos podem ser trocados em qualquer contexto de música sem alteração de sentido.",
    options: tf(false), rationale: "Falso! O Simple Past foca em tempo encerrado, enquanto o Present Perfect enfatiza a conexão com o presente." },
  { type: "completion", typeText: FILL, songInfo: "Oasis - Wonderwall", videoId: "bx1Bh8ZvH84",
    question: 'Complete a estrutura negativa com a contração correta para o sujeito I: "I _______ found the meaning yet."',
    correctAnswer: "haven't", rationale: 'Para a primeira pessoa (I) na negativa abreviada, usa-se "haven\'t".' },
];

export function checkCompletion(input: string, answer: string) {
  const u = input.trim().toLowerCase().replace(/[’`]/g, "'");
  const c = answer.toLowerCase();
  return u === c || u.includes(c);
}

export function performanceMessage(score: number) {
  if (score >= 1000) return "Lendário! Você é um verdadeiro mestre do Present Perfect e da música!";
  if (score >= 600) return "Excelente pontuação! Domínio sólido da matéria.";
  return "Bom esforço! Revise as regras de auxiliares e tente subir o seu score.";
}
