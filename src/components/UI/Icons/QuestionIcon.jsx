const QuestionIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
      >
        <g fill="none" stroke="currentColor" strokeWidth={1.2}>
          <circle
            cx={12}
            cy={12}
            r={9}
            fill="currentColor"
            fillOpacity={0.25}
            strokeWidth={1.2}
          ></circle>
          <circle
            cx={12}
            cy={18}
            r={0.6}
            fill="currentColor"
            strokeWidth={0.2}
          ></circle>
          <path
            strokeWidth={1.2}
            d="M12 16v-.857c0-.714.357-1.381.951-1.777l.599-.4a3.26 3.26 0 0 0 1.45-2.71V10a3 3 0 1 0-6 0"
          ></path>
        </g>
      </svg>
    </>
  );
};
export default QuestionIcon;
