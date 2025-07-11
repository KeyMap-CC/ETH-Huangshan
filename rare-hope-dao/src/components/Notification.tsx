export default function Notification({ message }: { message: string }) {
  return (
    <div className="mx-auto text-center text-lg text-customFontColor">
      {message}
    </div>
  );
}
