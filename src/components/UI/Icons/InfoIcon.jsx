const InfoIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={64}
        height={64}
        viewBox="0 0 24 24"
        style={{ width: "8rem", height: "8rem", color: "orange" }}
      >
        <g
          fill="currentColor"
          fillOpacity={0}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        >
          <path
            strokeDasharray={64}
            strokeDashoffset={64}
            d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.48s"
              values="64;0"
            ></animate>
          </path>
          <path
            fill="none"
            strokeDasharray={8}
            strokeDashoffset={8}
            d="M12 7v6"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.48s"
              dur="0.16s"
              values="8;0"
            ></animate>
          </path>
          <path
            fill="none"
            strokeDasharray={2}
            strokeDashoffset={2}
            d="M12 17v0.01"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.64s"
              dur="0.16s"
              values="2;0"
            ></animate>
          </path>
          <animate
            fill="freeze"
            attributeName="fill-opacity"
            begin="0.88s"
            dur="0.12s"
            values="0;0.35"
          ></animate>
        </g>
      </svg>
    </>
  );
};
export default InfoIcon;
