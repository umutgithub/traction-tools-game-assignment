import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";

import BoardHelpers from "./features/tic-tac-toe/BoardHelpers";

//Get an instance of the board before running test cases.
const board = new BoardHelpers();

test("renders learn react link", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText("Easy")).toBeInTheDocument();
});

test("GetWinner Returns X as winner.", () => {
  const XwinningScenarioGrid = [null, null, 1, 2, 2, 1, null, null, 1];
  expect(board.getWinner(XwinningScenarioGrid).winner).toBe("X");
});

test("GetWinner Returns O as winner.", () => {
  const OwinningScenarioGrid = [2, 1, 1, null, 2, 1, null, null, 2];
  expect(board.getWinner(OwinningScenarioGrid).winner).toBe("O");
});

test("Draw Scenario.", () => {
  const drawScenarioGrid = [1, 1, 2, 2, 1, 1, 1, 2, 2];
  expect(board.getWinner(drawScenarioGrid).res).toBe(0);
});
