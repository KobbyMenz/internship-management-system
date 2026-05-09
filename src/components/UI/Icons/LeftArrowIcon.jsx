const LeftArrowIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={64}
        height={64}
        viewBox="0 0 24 24"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeDasharray={10}
          strokeDashoffset={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.2}
        >
          <path d="M12 12l5 -5M12 12l5 5">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.24s"
              values="10;0"
            ></animate>
          </path>
          <path d="M6 12l5 -5M6 12l5 5">
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.24s"
              dur="0.24s"
              values="10;0"
            ></animate>
          </path>
        </g>
      </svg>
    </>
  );
};

export default LeftArrowIcon;
