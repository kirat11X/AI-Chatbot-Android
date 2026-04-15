type IconName =
  | 'close'
  | 'history'
  | 'menu'
  | 'more'
  | 'plus'
  | 'refresh'
  | 'send'
  | 'settings'
  | 'spark'
  | 'status'

interface IconProps {
  name: IconName
  className?: string
}

const iconPaths: Record<IconName, string[]> = {
  close: ['M6 6l12 12', 'M18 6 6 18'],
  history: [
    'M4 12a8 8 0 1 0 2.343-5.657',
    'M4 4v5h5',
    'M12 8v5l3 2',
  ],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  more: ['M6 12h.01', 'M12 12h.01', 'M18 12h.01'],
  plus: ['M12 5v14', 'M5 12h14'],
  refresh: ['M20 11a8 8 0 0 0-13.657-4.657L4 9', 'M4 4v5h5', 'M4 13a8 8 0 0 0 13.657 4.657L20 15', 'M20 20v-5h-5'],
  send: ['M4 12 20 4l-5 16-3.5-5.5L4 12Z', 'm11.5 14.5 8.5-10.5'],
  settings: [
    'M12 3v2.2',
    'M12 18.8V21',
    'M4.93 4.93l1.56 1.56',
    'M17.51 17.51l1.56 1.56',
    'M3 12h2.2',
    'M18.8 12H21',
    'M4.93 19.07l1.56-1.56',
    'M17.51 6.49l1.56-1.56',
    'M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z',
  ],
  spark: ['M12 3 14.4 9.6 21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z'],
  status: [
    'M5 13.5 9 17l10-10',
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  ],
}

export function Icon({ name, className }: IconProps) {
  const paths = iconPaths[name]

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths.map((path, index) => (
        <path d={path} key={`${name}-${index}`} />
      ))}
    </svg>
  )
}
