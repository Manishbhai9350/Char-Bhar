import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface RulesProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RULES: string[] = [
  "Each player has 3 pieces and takes turns placing them one at a time on any empty corner.",
  "Once both players have placed all 3 pieces, the player who placed first also moves first.",
  "You can only move a piece to a neighbouring corner — no jumping over corners or skipping to a far one.",
  "You cannot complete a straight line while placing your pieces. A win only counts if it happens as a result of a move.",
  "Once you make a move, it's final — you can't undo it, and you'll have to wait for your next turn to try again.",
  "The first player to line up all 3 of their pieces in a straight line — row, column, or diagonal — wins.",
];

const RulesPopup = ({ setOpen, open }: RulesProps) => {
  const RulesRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    if (open) {
      gsap.set(RulesRef.current, {
        display: "block",
        opacity: 1,
      });
    } else {
      gsap.to(RulesRef.current, {
        opacity: 0,
        onComplete() {
          gsap.set(RulesRef.current, {
            display: "none",
          });
        },
      });
    }
  }, [open]);

  return (
    <div onBlur={() => setOpen(false)} ref={RulesRef} className="rules-popup">
      <h2 className="rules-popup__title">How to play</h2>
      <ul className="rules-popup__list">
        {RULES.map((rule, i) => (
          <li key={i} className="rules-popup__item">
            {rule}
          </li>
        ))}
      </ul>
      <button onClick={() => setOpen(false)} className="close_button">
        Close
      </button>
    </div>
  );
};

export default RulesPopup;
