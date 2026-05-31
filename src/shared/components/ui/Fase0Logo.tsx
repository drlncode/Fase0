interface Props {
    className?: string;
    color: "white" | "black";
}

export function Fase0Logo({ className, color }: Props) {
    return <img src={`/fase0-logo-${color}.svg`} className={className} alt="Fase0" />;
}
