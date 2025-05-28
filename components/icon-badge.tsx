import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { FC } from "react";
import { LucideIcon } from "lucide-react"; // If you're using lucide icons

const backgroundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-emerald-100",
        success: "bg-emerald-100",
      },
      size: {
        default: "p-2",
        sm: "p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const iconVariants = cva("", {
  variants: {
    variant: {
      default: "text-emerald-600",
      success: "text-emerald-700",
    },
    size: {
      default: "h-8 w-8",
      sm: "h-4 w-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// Type for props
type IconBadgeProps = {
  icon: LucideIcon; // or React.ComponentType<{ className?: string }>
} & VariantProps<typeof backgroundVariants>;

export const IconBadge: FC<IconBadgeProps> = ({ icon: Icon, variant, size }) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};
