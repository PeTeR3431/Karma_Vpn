import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    action?: ReactNode;
}

export function Card({ children, className, title, action }: CardProps) {
    return (
        <div className={clsx("bg-surface/50 rounded-3xl border border-white/5 p-6 backdrop-blur-xl", className)}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-6">
                    {title && <h3 className="text-lg font-semibold text-white/90">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
