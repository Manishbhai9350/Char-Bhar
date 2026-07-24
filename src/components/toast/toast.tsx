import { useRef } from "react";
import "./css/toaster.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useGame } from "../../context/game/game.hook";

const Toast = () => {
  const ToastRef = useRef<HTMLDivElement | null>(null);

  const { toast } = useGame();

  useGSAP(() => {
    if (!ToastRef.current) return;
    if (toast.length > 0) {
      gsap.fromTo(
        ToastRef.current,
        {
          top: "-100%",
        },
        {
          top: 10,
          duration: 0.7,
          ease: "power1.out",
        },
      );
    } else {
      gsap.to(ToastRef.current, { top: "-100%" });
    }

    return () => gsap.to(ToastRef.current, { top: "-100%" });
  }, [toast]);

  return (
    <div ref={ToastRef} className="toaster">
      <p>{toast}</p>
    </div>
  );
};

export default Toast;
