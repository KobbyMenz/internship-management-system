// import styled from "styled-components";

import styled from "@emotion/styled";

const Switch = ({ onSwitch, switchMode }) => {
  return (
    <StyledWrapper>
      <div className="onoffswitch">
        <input
          checked={switchMode}
          onChange={onSwitch}
          //   defaultChecked
          id="myonoffswitch"
          className="onoffswitch-checkbox"
          name="onoffswitch"
          type="checkbox"
        />
        <label htmlFor="myonoffswitch" className="onoffswitch-label">
          <div className="onoffswitch-inner" />
          <div className="onoffswitch-switch" />
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .onoffswitch {
    position: relative;
    width: 10rem;
    user-select: none;
  }
  .onoffswitch-checkbox {
    display: none;
  }
  .onoffswitch-label {
    display: block;
    overflow: hidden;
    cursor: pointer;

    outline: 0.1rem solid var(--primary);
    outline-offset: 0.22rem;
    border-radius: 2rem;
  }
  .onoffswitch-inner {
    width: 200%;
    margin-left: -100%;
    transition: margin 0.3s ease-in 0s;
  }
  .onoffswitch-inner:before,
  .onoffswitch-inner:after {
    float: left;
    width: 50%;
    height: 2.8rem;
    padding: 0;
    line-height: 3rem;
    font-size: 1.3rem;
    color: white;
    font-family: Trebuchet, Arial, sans-serif;
    font-weight: 600;
    box-sizing: border-box;
  }
  .onoffswitch-inner:before {
    content: "ADMIN";
    padding-left: 2rem;
    background-color: var(--primary);
    color: #ffffff;
  }
  .onoffswitch-inner:after {
    content: "STUDENT";
    padding-right: 1rem;
    background-color: var(--primary);
    color: #fff;
    text-align: right;
  }
  .onoffswitch-switch {
    width: 1.8rem;
    margin: 0.6rem;
    background: #ffffff;
    border: 0.2rem solid var(--primary);
    border-radius: 2rem;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 7rem;
    transition: all 0.3s ease-in 0s;
  }
  .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
    margin-left: 0;
  }
  .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
    right: 0px;
  }
`;

export default Switch;
