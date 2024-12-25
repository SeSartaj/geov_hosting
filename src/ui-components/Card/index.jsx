import * as React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/utils/cn';

const divider = (
  <div className="h-[1px] bg-[#E9E9E9] dark:bg-zinc-100 w-full" />
);

const ShadCNCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
ShadCNCard.displayName = 'ShadCNCard';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

const Card = ({ children, className, header, footer }) => {
  return (
    <ShadCNCard className={`z-0 overflow-hidden ${className}`}>
      {header && (
        <>
          <CardHeader className="p-2.5">{header}</CardHeader>
          {divider}
        </>
      )}
      <CardContent className="grid gap-4 p-2.5 overflow-y-auto overflow-x-hidden">
        {children}
      </CardContent>
      {footer && <CardFooter className="p-2.5">{footer}</CardFooter>}
    </ShadCNCard>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
};

export default Card;
