import clsx from "clsx";

interface RatingButtonColor {
  text: string;
  border: string;
  hover: string;
}

interface RatingButtonProps {
  label: string;
  value: number;
  color: RatingButtonColor;
  disabled: boolean;
  handleRate: (confidence: number) => void;
}

const RatingButton = ({
  label,
  value,
  color,
  disabled,
  handleRate,
}: RatingButtonProps) => (
  <button
    onClick={() => handleRate(value)}
    disabled={disabled}
    className={clsx(
      "flex-1 min-w-0 px-2 py-1 text-sm font-medium rounded-md border",
      "transition-colors duration-150",
      color.text,
      color.border,
      disabled ? "opacity-40" : [color.hover, "hover:cursor-pointer"],
      "max-w-[80px] tracking-normal focus:outline-none focus:ring-0 focus-visible:ring-0",
    )}
  >
    {label}
  </button>
);

export default RatingButton;
