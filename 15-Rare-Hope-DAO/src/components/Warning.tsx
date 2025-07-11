export default function Warning({ message }: { message: string }) {
  return (
    <div className="mx-auto text-center text-lg font-bold text-red-500">
      {message}
    </div>
  );
}
