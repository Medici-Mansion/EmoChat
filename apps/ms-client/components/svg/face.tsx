import React, { HTMLAttributes } from 'react'

interface FaceProps extends HTMLAttributes<HTMLOrSVGElement> {}

const Face = (props: FaceProps) => {
  return (
    <svg
      width="58"
      height="64"
      viewBox="0 0 58 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M56.5349 52.8179C58.1853 51.2935 58.2873 48.7199 56.7629 47.0695C55.2383 45.4191 52.6648 45.3171 51.0144 46.8414C45.142 52.2659 37.5018 55.2533 29.5014 55.2533C21.501 55.2533 13.8608 52.2659 7.98838 46.8414C6.3377 45.3171 3.76451 45.4193 2.23994 47.0695C0.715521 48.7199 0.81752 51.2935 2.46789 52.8179C9.84817 59.6349 19.4486 63.3891 29.5014 63.3891C39.5542 63.3891 49.1546 59.6349 56.5349 52.8179Z"
        fill="white"
      />
      <rect
        x="24.3604"
        y="10.4395"
        width="9.28"
        height="25.52"
        rx="4.64"
        fill="white"
      />
      <circle cx="4.64" cy="4.64" r="4.64" fill="white" />
      <circle cx="53.3597" cy="4.64" r="4.64" fill="white" />
    </svg>
  )
}

export default Face
