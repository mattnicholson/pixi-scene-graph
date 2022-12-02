import React from "react";

const Context = React.createContext(null);

const AppProvider = Context.Provider;
const AppConsumer = Context.Consumer;

const withPixiApp = (BaseComponent) => {
  const wrapper = React.forwardRef((props, ref) => {
    return (
      <AppConsumer>
        {(value) => (
          <BaseComponent
            {...props}
            ref={ref}
            app={value.app}
            api={value.api}
            root={props.root ? props.root : value.root}
          />
        )}
      </AppConsumer>
    );
  });
  wrapper.displayName = `withPIXIApp(${
    BaseComponent.displayName || BaseComponent.name
  })`;
  return wrapper;
};

export { withPixiApp, AppProvider, AppConsumer, Context };
