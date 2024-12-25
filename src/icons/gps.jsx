export const GPSIcon = (props) => {
  console.log('props: ', props);
  const mainColor = props?.colors?.mainColor || '#20A35F';
  const secondaryColor = props?.colors?.secondaryColor || '#5CCC91';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={75}
      height={89}
      viewBox="0 0 75 89"
      fill="none"
      {...props}
    >
      <path
        fill="url(#a)"
        d="M38.807 86.158c0 1.573-5.262 2.842-11.769 2.842-6.507 0-11.769-1.27-11.769-2.842s5.262-2.836 11.77-2.836c6.506 0 11.768 1.269 11.768 2.836Z"
        opacity={0.28}
        style={{
          mixBlendMode: 'multiply',
        }}
      />
      <path
        fill={secondaryColor}
        d="M27.066 41a15.967 15.967 0 0 0-11.355 4.78A16.445 16.445 0 0 0 11 57.304c0 5.858 2.69 12.076 7.753 17.99a46.558 46.558 0 0 0 7.678 7.204c.186.134.407.207.635.209a1.22 1.22 0 0 0 .654-.209 47.763 47.763 0 0 0 7.659-7.203c5.081-5.915 7.753-12.133 7.753-17.99A16.445 16.445 0 0 0 38.42 45.78 15.967 15.967 0 0 0 27.066 41Z"
      />
      <path
        fill={mainColor}
        d="M27.038 72.025c7.36 0 13.327-6.055 13.327-13.523S34.398 44.98 27.038 44.98s-13.327 6.055-13.327 13.523 5.967 13.522 13.327 13.522Z"
      />
      <g fill="#fff" filter="url(#b)">
        <path d="M24.7 67.484c-1.854 0-3.485-.673-4.894-2.021-1.41-1.349-2.114-3.173-2.114-5.474 0-1.447.526-3.016 1.577-4.707 1.051-1.691 2.643-3.52 4.775-5.484a1.043 1.043 0 0 1 .657-.252 1.042 1.042 0 0 1 .657.251c2.132 1.966 3.723 3.794 4.775 5.485 1.051 1.691 1.577 3.26 1.577 4.707 0 2.3-.705 4.125-2.114 5.474-1.41 1.348-3.04 2.021-4.895 2.021Zm.242-2.742a.688.688 0 0 0 .45-.216.655.655 0 0 0 .185-.47.688.688 0 0 0-.197-.513.617.617 0 0 0-.504-.172c-.599.046-1.234-.125-1.905-.513-.672-.39-1.096-1.094-1.27-2.115a.677.677 0 0 0-.658-.57.623.623 0 0 0-.503.239c-.132.16-.176.347-.132.56.248 1.386.832 2.376 1.752 2.97.92.595 1.847.861 2.782.8Z" />
        <path
          stroke={mainColor}
          d="M36.917 56.87v-.5H34.05c-.942 0-1.844.38-2.508 1.054a3.6 3.6 0 0 0-.919 1.62 3.498 3.498 0 0 0-1.984-.615H25.77v2.903c0 .95.372 1.861 1.035 2.535a3.522 3.522 0 0 0 2.51 1.053h1.19v1.998a.84.84 0 0 0 .838.843.84.84 0 0 0 .839-.843v-4.057h1.19c.943 0 1.846-.38 2.51-1.053a3.612 3.612 0 0 0 1.035-2.535V56.87Zm-6.606 6.386Z"
        />
      </g>
      <defs>
        <radialGradient
          id="a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(11.7583 0 0 2.82937 27.16 85.136)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.177} />
          <stop offset={0.453} stopOpacity={0.53} />
          <stop offset={0.911} stopOpacity={0} />
        </radialGradient>
        <filter
          id="b"
          width={73.725}
          height={72.715}
          x={0.692}
          y={0.546}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dx={10} dy={-22} />
          <feGaussianBlur stdDeviation={13.5} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.26 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_51_5575"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_51_5575"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
