import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  children: ReactNode;
}

export function Card({ title, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`.trim()}
      {...props}
    >
      {title ? (
        <h3 className="mb-2 text-base font-semibold text-slate-900">{title}</h3>
      ) : null}
      <div className="text-sm text-slate-600">{children}</div>
    </div>
  );
}
