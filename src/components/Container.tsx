import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ContainerProps extends React.ComponentProps<'div'> {}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div className={cn('w-full mx-auto px-5', className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
