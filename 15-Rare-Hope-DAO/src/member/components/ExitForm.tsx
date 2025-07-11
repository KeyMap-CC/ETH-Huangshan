interface ExitFormProps {
  onSubmit: (e: React.FormEvent) => void;
  exitNote: string;
  setExitNote: (value: string) => void;
}

export default function ExitForm({
  onSubmit,
  exitNote,
  setExitNote,
}: ExitFormProps) {
  return (
    <div className="mt-4 rounded border p-4">
      <h3 className="mb-2 text-lg font-medium">退出成员</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            退出备注
          </label>
          <input
            type="text"
            value={exitNote}
            onChange={(e) => setExitNote(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          提交
        </button>
      </form>
    </div>
  );
}
