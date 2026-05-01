export default function LeisurePlant() {
  return (
    <>
      <path d="M0 0 L0 -32" stroke="#7A8C6C" strokeWidth="1" />
      <ellipse cx="-6" cy="-18" rx="4" ry="1.8" fill="#7A8C6C" transform="rotate(-28 -6 -18)" />
      <ellipse cx="6" cy="-14" rx="4" ry="1.8" fill="#8B9A7C" transform="rotate(22 6 -14)" />
      <g transform="translate(0 -32)">
        <ellipse cx="0" cy="-6" rx="2.5" ry="4.5" fill="#FAF3E4" />
        <ellipse cx="0" cy="6" rx="2.5" ry="4.5" fill="#FAF3E4" />
        <ellipse cx="6" cy="0" rx="4.5" ry="2.5" fill="#FAF3E4" />
        <ellipse cx="-6" cy="0" rx="4.5" ry="2.5" fill="#FAF3E4" />
        <ellipse cx="4.5" cy="-4.5" rx="3.5" ry="2" fill="#FAF3E4" transform="rotate(-45 4.5 -4.5)" />
        <ellipse cx="-4.5" cy="-4.5" rx="3.5" ry="2" fill="#FAF3E4" transform="rotate(45 -4.5 -4.5)" />
        <ellipse cx="4.5" cy="4.5" rx="3.5" ry="2" fill="#FAF3E4" transform="rotate(45 4.5 4.5)" />
        <ellipse cx="-4.5" cy="4.5" rx="3.5" ry="2" fill="#FAF3E4" transform="rotate(-45 -4.5 4.5)" />
        <circle cx="0" cy="0" r="2.8" fill="#E4B984" />
      </g>
    </>
  );
}
