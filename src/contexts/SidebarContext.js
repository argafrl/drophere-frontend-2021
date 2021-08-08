import React from "react";

export const defaultValue = {
  isSidebarOpen: false,
  openSidebar: () => {},
  closeSidebar: () => {},
  toogleSidebar: () => {},
};

export const SidebarContext = React.createContext(defaultValue);

export default class SidebarStore extends React.Component {
  state = defaultValue;

  openSidebar = () => {
    this.setState({ isSidebarOpen: true });
  };

  closeSidebar = () => {
    this.setState({ isSidebarOpen: false });
  };

  toogleSidebar = () => {
    this.setState((prevState) => ({
      isSidebarOpen: !prevState.isSidebarOpen,
    }));
  };

  render() {
    return (
      <SidebarContext.Provider
        value={{
          ...this.state,
          openSidebar: this.openSidebar,
          closeSidebar: this.closeSidebar,
          toogleSidebar: this.toogleSidebar,
        }}
      >
        {this.props.children}
      </SidebarContext.Provider>
    );
  }
}

export const withSidebar = (Comp) => (props) =>
  (
    <SidebarContext.Consumer>
      {(context) => <Comp {...props} sidebarContext={context} />}
    </SidebarContext.Consumer>
  );
