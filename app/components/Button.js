import { Button as BaseButton } from "@base-ui/react/button";

const base =
  "w-full cursor-pointer rounded-xl px-6 py-3 text-[16px] leading-6 font-bold transition-colors disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-background-brand text-content-inverse-primary hover:bg-background-pressed-primary-button disabled:bg-background-secondary disabled:text-content-tertiary",
  secondary:
    "bg-background-secondary text-content-brand hover:bg-background-pressed-secondary-button disabled:bg-background-secondary disabled:text-content-tertiary",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <BaseButton
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </BaseButton>
  );
}
