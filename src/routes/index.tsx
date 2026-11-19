import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QUESTIONS, checkCompletion, performanceMessage } from "@/lib/quiz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Present Perfect Arena — Arcade Quiz" },
      { name: "description", content: "Quiz arcade de Present Perfect com músicas internacionais: vidas, combos e cronômetro." },
      { property: "og:title", content: "Present Perfect Arena — Arcade Quiz" },
      { property: "og:description", content: "Domine o Present Perfect com músicas internacionais em modo arcade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type State = "start" | "playing" | "gameover" | "results";
const TIME = 25;

function Index() {
  const [state, setState] = useState<State>("start");
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(1);
  const [time, setTime] = useState(TIME);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(true);
  const q = QUESTIONS[idx]!;

  const resolve = (ok: boolean, points: number, delay = 2000) => {
    setAnswered(true);
    setCorrect(ok);
    if (ok) {
      setScore((s) => s + points * combo);
      setCombo((c) => c + 1);
    } else {
      setCombo(1);
      const left = lives - 1;
      setLives(left);
      if (left <= 0) setTimeout(() => setState("gameover"), delay);
    }
  };

  useEffect(() => {
    if (state !== "playing" || answered || listening) return;
    if (time <= 0) {
      resolve(false, 0, 1500);
      return;
    }
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, answered, listening, time]);

  const reset = () => {
    setAnswered(false);
    setSelected(null);
    setInput("");
    setListening(true);
    setTime(TIME);
  };
  const start = () => {
    setIdx(0); setScore(0); setLives(3); setCombo(1); reset(); setState("playing");
  };
  const next = () => {
    if (idx < QUESTIONS.length - 1) { setIdx(idx + 1); reset(); } else setState("results");
  };
  const pick = (i: number) => {
    if (answered || q.type === "completion") return;
    setSelected(i);
    resolve(q.options[i]?.isCorrect ?? false, 100);
  };
  const submit = () => {
    if (answered || !input.trim() || q.type !== "completion") return;
    resolve(checkCompletion(input, q.correctAnswer), 150);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-5 px-4 py-6">
      <header className="grid grid-cols-3 gap-2 rounded-2xl border bg-card p-3 text-center">
        <Stat label="Vidas" value={"❤️".repeat(Math.max(lives, 0)) || "—"} />
        <Stat label="Combo" value={`x${combo}`} accent />
        <Stat label="Pontuação" value={String(score)} accent />
      </header>

      {state === "playing" && !listening && (
        <div className="rounded-2xl border bg-card p-3">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Tempo Restante</span>
            <span className={time <= 5 ? "font-bold text-destructive" : "font-bold text-accent"}>{time}s</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-1000 ${time <= 5 ? "bg-destructive" : "bg-accent"}`}
              style={{ width: `${(time / TIME) * 100}%` }}
            />
          </div>
        </div>
      )}

      <section className="flex-1 rounded-3xl border bg-card p-6">
        {state === "start" && (
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="text-6xl">🕹️🎸</div>
            <span className="rounded-full border border-accent px-3 py-1 text-xs uppercase tracking-widest text-accent glow-accent">
              Modo Arcade Ativado
            </span>
            <h1 className="font-display text-2xl leading-relaxed text-neon sm:text-3xl">Present Perfect Arena</h1>
            <p className="max-w-md text-muted-foreground">
              Mostre que você domina as músicas internacionais! Mantenha suas 3 vidas, construa combos insanos e zere o desafio antes do tempo acabar.
            </p>
            <button onClick={start} className="btn-neon w-full rounded-2xl px-10 py-4 sm:w-auto">🎮 Iniciar Partida</button>
          </div>
        )}

        {state === "playing" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-display text-accent">Fase {idx + 1} / {QUESTIONS.length}</span>
              <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">{q.typeText}</span>
            </div>
            <div>
              <p className="mb-2 text-sm text-primary">🎵 Faixa: {q.songInfo}</p>
              <div className="mb-4 overflow-hidden rounded-xl border">
                <iframe
                  key={q.videoId}
                  src={`https://www.youtube.com/embed/${q.videoId}?cc_load_policy=1&cc_lang_pref=en&hl=en`}
                  title={`Videoclipe: ${q.songInfo}`}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {listening ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    🎧 Assista ao clipe com calma — a legenda em inglês já vem ativada (botão CC no player).
                    O cronômetro só começa quando você estiver pronto!
                  </p>
                  <button onClick={() => setListening(false)} className="btn-neon rounded-xl px-8 py-3.5">
                    Já ouvi! Começar Pergunta ⚡
                  </button>
                </div>
              ) : (
                <h2 className="text-lg font-semibold leading-snug">{q.question}</h2>
              )}
            </div>

            {!listening && (q.type !== "completion" ? (
              <div className="flex flex-col gap-3">
                {q.options.map((o, i) => {
                  let cls = "bg-secondary border-border hover:bg-muted";
                  if (answered && o.isCorrect) cls = "bg-success text-success-foreground border-success font-bold";
                  else if (answered && selected === i) cls = "bg-destructive text-destructive-foreground border-destructive";
                  else if (answered) cls = "bg-secondary/40 border-border opacity-40";
                  return (
                    <button key={i} disabled={answered} onClick={() => pick(i)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left font-medium transition ${cls}`}>
                      <span>{o.text}</span>
                      {answered && o.isCorrect && <span className="shrink-0 text-xs">PERFEITO! ✨</span>}
                      {answered && selected === i && !o.isCorrect && <span className="shrink-0 text-xs">ERROU! ❌</span>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()} disabled={answered}
                  placeholder="Digite o auxiliar ou verbo (ex: have found)"
                  className="w-full rounded-xl border bg-input/40 px-4 py-3.5 font-mono placeholder:text-muted-foreground focus:border-accent focus:outline-none" />
                <button onClick={submit} disabled={answered || !input.trim()} className="btn-neon rounded-xl px-8 py-3.5">
                  Confirmar ⚡
                </button>
              </div>
            ))}

            {!listening && answered && (
              <div className={`rounded-xl border p-4 ${correct ? "border-success" : "border-destructive"}`}>
                <p className={`font-bold ${correct ? "text-success" : "text-destructive"}`}>
                  {correct ? "Acertou! 🔥" : time <= 0 ? "Tempo esgotado! ⏰" : "Resposta incorreta 💥"}
                </p>
                {!correct && q.type === "completion" && (
                  <p className="mt-1 text-sm">Resposta: <span className="font-mono text-accent">{q.correctAnswer}</span></p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">{q.rationale}</p>
              </div>
            )}

            {!listening && answered && lives > 0 && (
              <button onClick={next} className="btn-neon self-end rounded-xl px-8 py-3.5 text-sm">
                {idx < QUESTIONS.length - 1 ? "Próxima Fase ▶" : "Ver Resultado 🏁"}
              </button>
            )}
          </div>
        )}

        {state === "gameover" && (
          <End emoji="💀" title="GAME OVER" text="Suas vidas acabaram! Continue ouvindo as músicas e tente novamente."
            score={score} label="Pontuação Final" cta="Tentar Novamente 🔄" onClick={() => setState("start")} />
        )}
        {state === "results" && (
          <End emoji="👑" title="FASE CONCLUÍDA!" text="Você completou o desafio arcade do Present Perfect."
            score={score} label="Pontuação Total" extra={performanceMessage(score)} cta="Jogar Novamente 🔄"
            onClick={() => setState("start")} />
        )}
      </section>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-sm ${accent ? "text-accent" : ""}`}>{value}</p>
    </div>
  );
}

function End(p: { emoji: string; title: string; text: string; score: number; label: string; extra?: string; cta: string; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <div className="text-6xl">{p.emoji}</div>
      <h2 className="font-display text-xl text-neon">{p.title}</h2>
      <p className="text-muted-foreground">{p.text}</p>
      <div className="w-full rounded-2xl border bg-secondary p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.label}</p>
        <p className="mt-2 font-display text-3xl text-accent">{p.score}</p>
        {p.extra && <p className="mt-3 text-sm">{p.extra}</p>}
      </div>
      <button onClick={p.onClick} className="btn-neon rounded-xl px-8 py-3.5">{p.cta}</button>
    </div>
  );
}
