import { NavLink } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export default function NavBar() {
  const customBg = {
    backgroundColor: '#DADEDF', // Use the custom color directly // #AA5500
  };

  return (
    <nav
      style={customBg}
      className="fixed top-0 z-50 mx-auto w-full border-b-2 border-customLineColor"
    >
      <div className="mx-auto flex h-16 max-w-4xl justify-between">
        <div className="flex items-center text-2xl font-bold text-customFontColor hover:scale-105">
          <img
            src="heart.png"
            width={50}
            height={50}
            alt="Heart"
            className="hover:brightness-120 rounded-lg hover:filter"
          />
          <NavLink to="/">希罕DAO</NavLink>
        </div>
        <ul className="flex items-center justify-end">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `py-2 pr-6 text-base font-bold text-customFontColor hover:text-lg ${
                isActive ? 'underline underline-offset-4' : ''
              }`
            }
          >
            主页
          </NavLink>
          <NavLink
            to="/member"
            className={({ isActive }) =>
              `py-2 pr-6 text-base font-bold text-customFontColor hover:text-lg ${
                isActive ? 'underline underline-offset-4' : ''
              }`
            }
          >
            成员
          </NavLink>
          <NavLink
            to="/sponsor"
            className={({ isActive }) =>
              `py-2 pr-6 text-base font-bold text-customFontColor hover:text-lg ${
                isActive ? 'underline underline-offset-4' : ''
              }`
            }
          >
            赞助者
          </NavLink>
          <NavLink
            to="/reviewer"
            className={({ isActive }) =>
              `py-2 pr-6 text-base font-bold text-customFontColor hover:text-lg ${
                isActive ? 'underline underline-offset-4' : ''
              }`
            }
          >
            审核员
          </NavLink>
          <ConnectButton accountStatus="address" showBalance={false} />
          <a
            className="py-2 pl-6"
            href="https://t.me/rd_awareness"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="telegram.png"
              width={40}
              height={40}
              alt="Telegram"
              className="rounded-lg hover:brightness-50 hover:filter"
            />
          </a>
          <a
            className="py-2 pl-6"
            href="https://x.com/mas_awareness_c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="x.jpg"
              width={40}
              height={40}
              alt="Twitter"
              className="rounded-lg hover:brightness-50 hover:filter"
            />
          </a>
        </ul>
      </div>
    </nav>
  );
}
