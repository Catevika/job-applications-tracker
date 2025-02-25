import { useFormStatus } from 'react-dom';
import { LuLoader } from "react-icons/lu";

type Props = {
  title: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  pendingText?: string;
  buttonText?: string;
  isPending?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

const PendingButton = ({ title, type, className, pendingText, buttonText, disabled, ...props }: Props) => {
  const { pending } = useFormStatus();
  const PendingOrIsPending = pending || props.isPending || disabled;
  return (
    <button title={title} type={type} {...props} className={className} disabled={PendingOrIsPending}>
      {PendingOrIsPending ? (
        <>
          <LuLoader className="mr-2 h-4 w-4 animate-spin" /> {pendingText}
        </>
      ) : buttonText}
    </button>
  );
};
export default PendingButton;
