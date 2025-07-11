interface UpdateFormProps {
  onSubmit: (e: React.FormEvent) => void;
  updateName: string;
  setUpdateName: (value: string) => void;
  updateInfo: string;
  setUpdateInfo: (value: string) => void;
}

export default function UpdateForm({
  onSubmit,
  updateName,
  setUpdateName,
  updateInfo,
  setUpdateInfo,
}: UpdateFormProps) {
  return (
    <div className="mt-4 rounded border p-4">
      <h3 className="mb-2 text-lg font-medium">更新成员信息</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            称呼
          </label>
          <input
            type="text"
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            更多信息
          </label>
          <input
            type="text"
            value={updateInfo}
            onChange={(e) => setUpdateInfo(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          提交
        </button>
      </form>
    </div>
  );
}
