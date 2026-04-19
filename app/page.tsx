import Image from 'next/image';
import type { CSSProperties, ReactElement } from 'react';

type Planet = {
  name: string;
  size: number;
  orbit: number;
  duration: number;
  delay: number;
  color: string;
  glow: string;
};

const planets: Planet[] = [
  {
    name: 'meridian',
    size: 24,
    orbit: 210,
    duration: 14,
    delay: 0,
    color: '#6ed0ff',
    glow: 'rgba(90, 214, 255, 0.55)',
  },
  {
    name: 'aurora',
    size: 34,
    orbit: 300,
    duration: 20,
    delay: -3,
    color: '#9c84ff',
    glow: 'rgba(156, 132, 255, 0.6)',
  },
  {
    name: 'ember',
    size: 18,
    orbit: 390,
    duration: 26,
    delay: -6,
    color: '#ff9a54',
    glow: 'rgba(255, 153, 86, 0.52)',
  },
];

function getStarStyle(index: number): CSSProperties {
  const left = (index * 73) % 100;
  const top = (index * 41) % 100;
  const scale = 0.65 + ((index * 13) % 35) / 100;
  const opacity = 0.35 + ((index * 19) % 45) / 100;

  return {
    left: `${left}%`,
    top: `${top}%`,
    opacity,
    transform: `scale(${scale})`,
    animationDelay: `${-(index % 9)}s`,
    animationDuration: `${5 + (index % 7)}s`,
  };
}

function HeaderNav(): ReactElement {
  const navItems = ['Home', 'About', 'Gallery', 'Books', 'Contact', 'Journal'];

  return (
    <header className="absolute left-6 right-6 top-6 z-20 rounded-full border border-[#a8bcff59] bg-[linear-gradient(120deg,rgba(28,43,74,0.75),rgba(14,21,39,0.9))] px-4 py-2 shadow-[0_12px_32px_rgba(3,7,18,0.6),inset_0_0_18px_rgba(164,198,255,0.2)] backdrop-blur-[14px] md:left-8 md:right-8 md:px-5">
      <div className="flex items-center justify-between gap-5 max-md:flex-col max-md:items-stretch">
        <a href="/" className="inline-flex items-center justify-center text-none">
          <Image
            src="/eon-logo.png"
            alt="EON logo"
            width={240}
            height={96}
            priority
            className="h-auto w-[clamp(100px,12.5vw,160px)]"
          />
        </a>
        <nav aria-label="Primary navigation">
          <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-1 p-0">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="inline-block rounded-full px-3 py-1.5 text-[0.95rem] tracking-[0.04em] text-[#d8e5ff] transition-all duration-200 hover:bg-[linear-gradient(140deg,rgba(108,146,255,0.32),rgba(79,223,255,0.2))] hover:text-white hover:shadow-[0_0_20px_rgba(82,170,255,0.35),inset_0_0_14px_rgba(189,225,255,0.25)]"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function SpaceHero(): ReactElement {
  const stars = Array.from({ length: 52 }, (_, index) => index);

  return (
    <section
      className="relative min-h-screen overflow-hidden border-y border-[#96beff47] bg-[radial-gradient(circle_at_18%_28%,rgba(94,162,255,0.17),transparent_56%),radial-gradient(circle_at_76%_68%,rgba(165,102,255,0.16),transparent_48%),linear-gradient(150deg,rgba(8,15,31,0.92),rgba(5,10,23,0.97))] pt-32 [perspective:1300px] [transform-style:preserve-3d] md:pt-36"
      aria-label="Animated cosmic scene"
    >
      <div
        className="absolute inset-x-[20%] top-[12%] z-0 h-[34%] blur-[28px]"
        style={{ background: 'radial-gradient(circle, rgba(82, 183, 255, 0.22), transparent 68%)' }}
      />
      <div className="absolute inset-0 z-[1]" aria-hidden="true">
        {stars.map((starIndex) => (
          <span key={starIndex} className="star absolute h-[3px] w-[3px] rounded-full bg-[#f2f7ff]" style={getStarStyle(starIndex)} />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 z-[3] h-[clamp(58px,8vw,92px)] w-[clamp(58px,8vw,92px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,#eef7ff,#79b4ff_45%,#32579f_70%)] shadow-[0_0_54px_rgba(122,192,255,0.48),inset_-10px_-14px_24px_rgba(8,20,45,0.5)]" />
      {planets.map((planet) => (
        <div
          key={planet.name}
          className="orbit-ring absolute left-1/2 top-1/2 z-[2] rounded-full border border-[#96c8ff4d]"
          style={{
            width: `${planet.orbit}px`,
            height: `${planet.orbit}px`,
            animationDuration: `${planet.duration}s`,
            animationDelay: `${planet.delay}s`,
          }}
          aria-hidden="true"
        >
          <span
            className="absolute left-1/2 top-[-9px] rounded-full"
            style={{
              width: `${planet.size}px`,
              height: `${planet.size}px`,
              marginLeft: `${-(planet.size / 2)}px`,
              background: `radial-gradient(circle at 30% 30%, #ffffff, ${planet.color} 55%)`,
              boxShadow: `0 0 24px ${planet.glow}`,
            }}
          />
        </div>
      ))}
    </section>
  );
}

export function HomePage() {
  return (
    <main className="relative min-h-screen bg-[radial-gradient(circle_at_top,#1c2b4a,#070b14_60%)] text-[#f4f7ff]">
      <HeaderNav />
      <SpaceHero />
    </main>
  );
}

export default HomePage;
