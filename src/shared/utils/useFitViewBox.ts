import { useEffect, useRef } from "react";

export function useFitViewBox() {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = ref.current;
        if (!svg) return;
        const { x, y, width, height } = svg.getBBox();
        svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
    }, []);

    return ref;
}
