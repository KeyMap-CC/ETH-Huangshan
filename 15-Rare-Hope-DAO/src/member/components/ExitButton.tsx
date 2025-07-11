import { RoleStatus } from '../../hooks/constants';

interface ExitButtonProps {
  memberStatus: RoleStatus;
  onClick: () => void;
}

export default function ExitButton({ memberStatus, onClick }: ExitButtonProps) {
  if (memberStatus !== RoleStatus.Active) return null;

  return (
    <button
      onClick={onClick}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      退出
    </button>
  );
}
