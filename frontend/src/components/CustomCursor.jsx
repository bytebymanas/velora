import { useEffect, useRef } from "react";

export function CustomCursor() {
    const glowRef = useRef(null);

    useEffect(() => {
        const glow = glowRef.current;
        if (!glow) return;

        let x = 0;
        let y = 0;
        let glowX = 0;
        let glowY = 0;

        function onMove(e) {
            x = e.clientX;
            y = e.clientY;
        }

        function animate() {
            glowX += (x - glowX) * 0.08;
            glowY += (y - glowY) * 0.08;
            glow.style.left = `${glowX}px`;
            glow.style.top = `${glowY}px`;
            requestAnimationFrame(animate);
        }

        document.addEventListener("mousemove", onMove);
        animate();

        return () => document.removeEventListener("mousemove", onMove);
    }, []);

    return <div className="cursor-glow" ref={glowRef} />;
}
