import React from "react";

const Themecontext = React.createContext();

export const ThemeConsumer = Themecontext.Consumer;
export const ThemeProvider = Themecontext.Provider;

export default Themecontext;
