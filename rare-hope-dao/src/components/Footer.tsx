import '../index.css';

export default function Footer() {
  return (
    <footer className="mt-6 flex items-center justify-center border-t-2 border-customLineColor py-4 text-customFontColor">
      &copy; 2025 by&nbsp;
      <a
        className="text-blue-500"
        href="https://x.com/RicBuidler"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ric Li C
      </a>
      . All rights reserved.
    </footer>
  );
}
