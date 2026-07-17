import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type JSX } from "react";
import "./css/home.css";

interface ModeOption {
  id: "single" | "local" | "online";
  title: string;
  description: string;
  cta: string;
  icon: "controller" | "people" | "globe";
  meta: { type: "difficulty"; label: string } | { type: "live-beta" };
  featured?: boolean;
}

type Step =
  | {
      type: "place";
      player: "teal" | "coral";
      pieceIndex: number;
      corner: number;
    }
  | {
      type: "move";
      player: "teal" | "coral";
      pieceIndex: number;
      corner: number;
    }
  | {
      type: "win";
      corners: [number, number, number];
      winner: "teal" | "coral";
    };

const STORY_CENTER_COLUMN: Step[] = [
  { type: "place", player: "teal", pieceIndex: 0, corner: 4 },
  { type: "place", player: "coral", pieceIndex: 0, corner: 0 },
  { type: "place", player: "teal", pieceIndex: 1, corner: 2 },
  { type: "place", player: "coral", pieceIndex: 1, corner: 6 },
  { type: "place", player: "teal", pieceIndex: 2, corner: 8 },
  { type: "place", player: "coral", pieceIndex: 2, corner: 5 },
  { type: "move", player: "teal", pieceIndex: 2, corner: 7 },
  { type: "move", player: "coral", pieceIndex: 1, corner: 3 },
  { type: "move", player: "teal", pieceIndex: 1, corner: 1 },
  { type: "win", corners: [1, 4, 7], winner: "teal" },
];

const STORY_DIAGONAL_STEAL: Step[] = [
  { type: "place", player: "coral", pieceIndex: 0, corner: 0 },
  { type: "place", player: "teal", pieceIndex: 0, corner: 4 },
  { type: "place", player: "coral", pieceIndex: 1, corner: 2 },
  { type: "place", player: "teal", pieceIndex: 1, corner: 6 },
  { type: "place", player: "coral", pieceIndex: 2, corner: 5 },
  { type: "place", player: "teal", pieceIndex: 2, corner: 3 },
  { type: "move", player: "coral", pieceIndex: 2, corner: 8 },
  { type: "move", player: "teal", pieceIndex: 1, corner: 7 },
  { type: "move", player: "teal", pieceIndex: 0, corner: 1 },
  { type: "move", player: "coral", pieceIndex: 2, corner: 4 },
  { type: "move", player: "teal", pieceIndex: 1, corner: 6 },
  { type: "move", player: "coral", pieceIndex: 1, corner: 5 },
  { type: "move", player: "teal", pieceIndex: 1, corner: 7 },
  { type: "move", player: "coral", pieceIndex: 1, corner: 8 },
  { type: "win", corners: [0, 4, 8], winner: "coral" },
];

const STORY_TRAP_1: Step[] = [
  { type: "place", player: "teal", pieceIndex: 0, corner: 4 },
  { type: "place", player: "coral", pieceIndex: 0, corner: 2 },
  { type: "place", player: "teal", pieceIndex: 1, corner: 1 },
  { type: "place", player: "coral", pieceIndex: 1, corner: 5 },
  { type: "place", player: "teal", pieceIndex: 2, corner: 8 },
  { type: "place", player: "coral", pieceIndex: 2, corner: 0 },
  { type: "move", player: "teal", pieceIndex: 2, corner: 7 },
  { type: "win", corners: [1, 4, 7], winner: "teal" },
];

const STORIES = [STORY_TRAP_1,STORY_DIAGONAL_STEAL,STORY_CENTER_COLUMN];

function playScript(
  script: Step[],
  teal: SVGCircleElement[],
  coral: SVGCircleElement[],
  winLine: SVGLineElement,
  label: HTMLElement,
) {
  const tl = gsap.timeline();

  script.forEach((step) => {
    const el =
      step.type !== "win"
        ? (step.player === "teal" ? teal : coral)[step.pieceIndex]
        : null;

    if (step.type === "place") {
      const [x, y] = CORNER_POS[step.corner];
      tl.set(el!, { attr: { cx: x, cy: y }, scale: 0, opacity: 0 }).to(
        el!,
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" },
        "+=0.3",
      );
    }

    if (step.type === "move") {
      const [x, y] = CORNER_POS[step.corner];
      tl.to(
        el!,
        { attr: { cx: x, cy: y }, duration: 0.5, ease: "power2.inOut" },
        "+=0.4",
      );
    }

    if (step.type === "win") {
      const [a, , c] = step.corners;
      const [x1, y1] = CORNER_POS[a];
      const [x2, y2] = CORNER_POS[c];
      const winners = step.winner === "teal" ? teal : coral;

      tl.set(winLine, { attr: { x1, y1, x2, y2 } })
        .to(
          winLine,
          { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" },
          "+=0.2",
        )
        .to(
          winners,
          { scale: 1.25, duration: 0.25, yoyo: true, repeat: 3 },
          "<",
        )
        .to(
          label,
          {
            opacity: 1,
            duration: 0.3,
            onStart: () => {
              label.textContent = `Player ${step.winner === "teal" ? "1" : "2"} wins`;
            },
          },
          "<",
        );
    }
  });

  return tl;
}

const MODES: ModeOption[] = [
  {
    id: "single",
    title: "Single player",
    description: "Play against the machine. Three difficulty levels.",
    cta: "Play vs AI",
    icon: "controller",
    meta: { type: "difficulty", label: "Difficulty: Adaptive" },
  },
  {
    id: "local",
    title: "Local multiplayer",
    description: "Pass the same device between two players.",
    cta: "Play together",
    icon: "people",
    meta: { type: "difficulty", label: "Difficulty: Variable" },
  },
  {
    id: "online",
    title: "Online battle",
    description: "Invite a friend and play in real time.",
    cta: "coming soon...",
    icon: "globe",
    meta: { type: "live-beta" },
    featured: true,
  },
];

const ICONS: Record<ModeOption["icon"], JSX.Element> = {
  controller: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 12h4M8 10v4M15 11h.01M17.5 13h.01" />
      <path d="M7.5 6h9a5 5 0 0 1 5 5v3a3 3 0 0 1-3 3c-.9 0-1.6-.4-2.2-1.1L15 14H9l-1.3 1.9C7.1 16.6 6.4 17 5.5 17A3 3 0 0 1 2.5 14v-3a5 5 0 0 1 5-5Z" />
    </svg>
  ),
  people: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 20c.2-2.7 1.5-4.2 3.5-4.6" />
    </svg>
  ),
  globe: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  ),
};

/**
 * A scripted mini playthrough on a small board: both players place
 * three pieces, make a couple of moves, and one move completes a
 * line — win only ever happens on a move, never a placement, same
 * as the real game's rule. Loops on repeat.
 */
const CORNER_POS: Record<number, [number, number]> = {
  0: [60, 60],
  1: [150, 60],
  2: [240, 60],
  3: [60, 150],
  4: [150, 150],
  5: [240, 150],
  6: [60, 240],
  7: [150, 240],
  8: [240, 240],
};

const LINE_SEGMENTS = [
  [0, 60, 60, 240, 60],
  [1, 60, 150, 240, 150],
  [2, 60, 240, 240, 240],
  [3, 60, 60, 60, 240],
  [4, 150, 60, 150, 240],
  [5, 240, 60, 240, 240],
  [6, 60, 60, 240, 240],
  [7, 240, 60, 60, 240],
];

function PlaythroughDemo() {
  const boardRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const teal = gsap.utils.toArray<SVGCircleElement>(
        ".pt-teal",
        boardRef.current,
      );
      const coral = gsap.utils.toArray<SVGCircleElement>(
        ".pt-coral",
        boardRef.current,
      );
      const winLine =
        boardRef.current!.querySelector<SVGLineElement>(".pt-winline")!;
      const label = boardRef.current!.querySelector<HTMLElement>(".pt-label")!;

      let cancelled = false;

      function runNext() {
        if (cancelled) return;

        gsap.set([...teal, ...coral], { opacity: 0 });
        gsap.set(winLine, { strokeDashoffset: 300 });
        gsap.set(label, { opacity: 0 });

        const script = STORIES[Math.floor(Math.random() * STORIES.length)];

        playScript(script, teal, coral, winLine, label)
          .to(
            [...teal, ...coral, winLine, label],
            { opacity: 1, duration: 0.4 },
            "+=1.2",
          )
          .call(() => {
            gsap.delayedCall(2, runNext);
          });
      }

      runNext();

      return () => {
        cancelled = true;
      };
    },
    { scope: boardRef },
  );

  return (
    <div className="pt-board" ref={boardRef} aria-hidden="true">
      <svg viewBox="0 0 300 300">
        <g className="pt-lines">
          {LINE_SEGMENTS.map(([key, x1, y1, x2, y2]) => (
            <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <line className="pt-winline" x1="150" y1="60" x2="150" y2="240" />
        {[0, 1, 2].map((i) => (
          <circle key={`t${i}`} className={`pt-teal teal--${i}`} r="11">
            {i}
          </circle>
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={`c${i}`} className={`pt-coral coral--${i}`} r="11" />
        ))}
      </svg>
      <span className="pt-label">Player 1 wins</span>
    </div>
  );
}

function Meta({ meta }: { meta: ModeOption["meta"] }) {
  if (meta.type === "difficulty") {
    return (
      <span className="mode-card__meta mode-card__meta--amber">
        {meta.label}
      </span>
    );
  }
  return (
    <div className="mode-card__meta-row">
      <span className="mode-card__live">
        <span className="mode-card__live-dot" />
        Live
      </span>
      <span className="mode-card__beta">Beta</span>
    </div>
  );
}

function ModeCard({
  mode,
  onSelect,
}: {
  mode: ModeOption;
  onSelect: (id: ModeOption["id"]) => void;
}) {
  return (
    <div className={`mode-card${mode.featured ? " mode-card--featured" : ""}`}>
      <div className={`mode-card__icon mode-card__icon--${mode.id}`}>
        {ICONS[mode.icon]}
      </div>
      <div className="mode-card__body">
        <h3 className="mode-card__title">{mode.title}</h3>
        <p className="mode-card__desc">{mode.description}</p>
        <Meta meta={mode.meta} />
      </div>
      <button className="mode-card__cta" onClick={() => onSelect(mode.id)}>
        {mode.cta}
      </button>
    </div>
  );
}

export default function Home({
  onSelectMode,
}: {
  onSelectMode: (mode: ModeOption["id"]) => void;
}) {
  return (
    <div className="home">
      <header className="home__header">
        <div className="home__wordmark">
          <span className="home__devanagari">चौबार</span>
          <span className="home__label">Char Bhar</span>
        </div>
        <nav className="home__nav">
          <button className="home__nav-link">Rules</button>
          <button
            className="home__nav-link home__nav-icon"
            aria-label="Toggle sound"
          >
            &#9834;
          </button>
        </nav>
      </header>

      <main className="home__hero">
        <PlaythroughDemo />
        <h1 className="home__title">Char Bhar</h1>
        <p className="home__tagline">Three ways to play. Pick your line.</p>
      </main>

      <section className="home__modes" aria-label="Choose a game mode">
        {MODES.map((mode) => (
          <ModeCard key={mode.id} mode={mode} onSelect={onSelectMode} />
        ))}
      </section>

      <footer className="home__footer">
        <p>Played on courtyards and school benches. Built by Manish Dhaka.</p>
      </footer>
    </div>
  );
}
