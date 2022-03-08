import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";
import "./App.css";

const authenticateUserNew = async (c, e) => {
  console.log("service invoked");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve();
      } else {
        reject();
      }
    }, 1000);
  });
};

const loginMachine = createMachine(
  {
    id: "login-machine",
    initial: "unauthenticated",
    context: {
      isAuthenticated: false,
    },
    states: {
      unauthenticated: {
        on: {
          AUTHENTICATING: {
            invoke: {
              id: "authenticateUser",
              src: (c, e) => authenticateUserNew(c, e),
              onDone: {
                target: "authenticated",
                actions: assign({ isAuthenticated: (context, event) => true }),
              },
              onError: {},
            },
          },
        },
      },
      authenticated: {
        on: {
          LOGOUT: {
            target: "unauthenticated",
          },
        },
      },
    },
  },
  {
    services: {
      authenticateUser: () => {
        console.log("service invoked");
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.5) {
              resolve();
            } else {
              reject();
            }
          }, 1000);
        });
      },
    },
  }
);

function App() {
  const [current, send] = useMachine(loginMachine);
  return (
    <div className="App">
      <h2>{current.value}</h2>
      <br />
      <h3>
        isAuthenticated: {current.context.isAuthenticated ? "True" : "False"}
      </h3>
      <br />
      <button onClick={() => send("AUTHENTICATING")}>AUTHENTICATE</button>
      <br />
      <button onClick={() => send("LOGOUT")}>LOGOUT</button>
    </div>
  );
}

export default App;
