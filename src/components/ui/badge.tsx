import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#E06D3B] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#1D3E2E] text-white hover:bg-[#152F22]',
        secondary: 'border-transparent bg-[#E8E2D5] text-[#1D3E2E] hover:bg-[#DCD3C0]',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline: 'border-[#DCD3C0] text-[#1D3E2E]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
