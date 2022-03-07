// import React from "react";
import styled from "styled-components";
import { Text, Box } from "rebass";

// import Link from './Link'

// import { urls } from '../../utils/formatters'

const Divider = styled(Box)`
  height: 1px;
  background-color: ${({ theme }) => theme.divider};
`;

export const BlockedWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BlockedMessageWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.text3};
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  max-width: 80%;
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 0;
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text1};

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const Hint = ({ children, ...rest }) => (
  <Text fontSize={16} weight={500} {...rest}>
    {children}
  </Text>
);

// const Address = ({ address, token, ...rest }) => (
//     <Link
//         color="button"
//         href={token ? urls.showToken(address) : urls.showAddress(address)}
//         external
//         style={{ wordBreak: 'break-all' }}
//         {...rest}
//     >
//         {address}
//     </Link>
// )

export const Hover = styled.div`
  :hover {
    cursor: pointer;
    opacity: ${({ fade }) => fade && "0.7"};
  }
`;

export const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text1};
`;

const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  height: ${({ height }) => height && height};
`;

export const SideBar = styled.span`
  display: grid;
  grid-gap: 24px;
  position: sticky;
  top: 4rem;
`;

export const SubNav = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  margin-bottom: 2rem;
`;
export const SubNavEl = styled.li`
  list-style: none;
  display: flex;
  padding-bottom: 0.5rem;
  margin-right: 1rem;
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  border-bottom: 1px solid rgba(0, 0, 0, 0);

  :hover {
    cursor: pointer;
    border-bottom: 1px solid ${({ theme }) => theme.bg3};
  }
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  padding-bottom: 80px;

  @media screen and (max-width: 600px) {
    & > * {
      padding: 0 12px;
    }
  }
`;

export const ContentWrapper = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;

  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`;

export const ContentWrapperLarge = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  padding: 0 2rem;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 1440px;
  width: 100%;

  @media screen and (max-width: 1282px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`;

export const FullWrapper = styled.div`
  display: grid;
  justify-content: start;
  align-items: start;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;

  @media screen and (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`;

export const FixedMenu = styled.div`
  z-index: 99;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  box-sizing: border-box;
  margin-bottom: 2rem;
  max-width: 100vw;

  @media screen and (max-width: 800px) {
    margin-bottom: 0;
  }
`;

const TextWrapper = styled(Text)`
  color: ${({ color, theme }) => theme[color]};
`;

// const theme = (darkMode, color) => ({
//   customColor: color,
//   textColor: darkMode ? color : "black",

//   panelColor: darkMode ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0)",
//   backgroundColor: darkMode ? "#bdbdbd" : "#bdbdbd",

//   uniswapPink: darkMode ? "#ff007a" : "black",

//   concreteGray: darkMode ? "#292C2F" : "#FAFAFA",
//   inputBackground: darkMode ? "#1F1F1F" : "#FAFAFA",
//   shadowColor: darkMode ? "#000" : "#2F80ED",
//   mercuryGray: darkMode ? "#333333" : "#E1E1E1",

//   text1: darkMode ? "#bbbbbb" : "#bbbbbb",
//   text2: darkMode ? "#C3C5CB" : "#565A69",
//   text3: darkMode ? "#6C7284" : "#888D9B",
//   text4: darkMode ? "#565A69" : "#C3C5CB",
//   text5: darkMode ? "#2C2F36" : "#EDEEF2",

//   // special case text types
//   white: "#FFFFFF",

//   // backgrounds / greys
//   bg1: darkMode ? "#212429" : "#FAFAFA",
//   bg2: darkMode ? "#2C2F36" : "#F7F8FA",
//   bg3: darkMode ? "#E0077D" : "#EDEEF2",
//   bg4: darkMode ? "#565A69" : "#CED0D9",
//   bg5: darkMode ? "#565A69" : "#888D9B",
//   bg6: darkMode ? "#000" : "#FFFFFF",

//   //specialty colors
//   modalBG: darkMode ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.6)",
//   advancedBG: darkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.4)",
//   onlyLight: darkMode ? "#22242a" : "transparent",
//   divider: darkMode ? "rgba(43, 43, 43, 0.435)" : "rgba(43, 43, 43, 0.035)",

//   //primary colors
//   primary1: darkMode ? "#2172E5" : "#ff007a",
//   primary2: darkMode ? "#3680E7" : "#FF8CC3",
//   primary3: darkMode ? "#4D8FEA" : "#FF99C9",
//   primary4: darkMode ? "#376bad70" : "#F6DDE8",
//   primary5: darkMode ? "#153d6f70" : "#FDEAF1",

//   // color text
//   primaryText1: darkMode ? "#6da8ff" : "#ff007a",

//   // secondary colors
//   secondary1: darkMode ? "#2172E5" : "#ff007a",
//   secondary2: darkMode ? "#17000b26" : "#F6DDE8",
//   secondary3: darkMode ? "#17000b26" : "#FDEAF1",

//   shadow1: darkMode ? "#000" : "#2F80ED",

//   // other
//   red1: "#FF6871",
//   green1: "#27AE60",
//   yellow1: "#FFE270",
//   yellow2: "#F3841E",
//   link: "#2172E5",
//   blue: "2f80ed",

//   background: darkMode
//     ? "black"
//     : `radial-gradient(50% 50% at 50% 50%, #ff007a30 0%, #fff 0%)`,
// });

const TYPE = {
  main(props) {
    return (
      <TextWrapper fontWeight={500} fontSize={14} color={"white"} {...props} />
    );
  },

  body(props) {
    return (
      <TextWrapper fontWeight={400} fontSize={14} color={"white"} {...props} />
    );
  },

  small(props) {
    return (
      <TextWrapper fontWeight={500} fontSize={11} color={"text1"} {...props} />
    );
  },

  header(props) {
    return <TextWrapper fontWeight={600} color={"text1"} {...props} />;
  },

  largeHeader(props) {
    return (
      <TextWrapper fontWeight={500} color={"text1"} fontSize={24} {...props} />
    );
  },

  light(props) {
    return (
      <TextWrapper fontWeight={400} color={"text3"} fontSize={14} {...props} />
    );
  },

  pink(props) {
    return (
      <TextWrapper
        fontWeight={props.faded ? 400 : 600}
        color={props.faded ? "text1" : "text1"}
        {...props}
      />
    );
  },
};

export { Hint, Divider, EmptyCard, TYPE };
