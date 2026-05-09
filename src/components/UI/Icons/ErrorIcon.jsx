const ErrorIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        style={{ width: "8rem", height: "8rem", color: "red" }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
        >
          <path
            fill="currentColor"
            fillOpacity={0}
            strokeDasharray={64}
            strokeDashoffset={64}
            d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
          >
            <animate
              fill="freeze"
              attributeName="fill-opacity"
              begin="0.48s"
              dur="0.12s"
              values="0;0.3"
            ></animate>
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.48s"
              values="64;0"
            ></animate>
          </path>
          <path
            strokeDasharray={8}
            strokeDashoffset={8}
            d="M12 12l4 4M12 12l-4 -4M12 12l-4 4M12 12l4 -4"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.6s"
              dur="0.16s"
              values="8;0"
            ></animate>
          </path>
        </g>
      </svg>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        style={{ width: "8rem", height: "8rem", color: "red" }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
        >
          <path
            strokeDasharray={64}
            strokeDashoffset={64}
            d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              dur="0.51s"
              values="64;0"
            ></animate>
          </path>
          <path
            strokeDasharray={8}
            strokeDashoffset={8}
            d="M12 12l4 4M12 12l-4 -4M12 12l-4 4M12 12l4 -4"
          >
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.51s"
              dur="0.17s"
              values="8;0"
            ></animate>
          </path>
        </g>
      </svg> */}
    </>
  );
};
export default ErrorIcon;
