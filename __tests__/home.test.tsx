import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("nanoid", () => ({
  nanoid: () => "mocked-nanoid-id",
}));

import HomePage from "../app/page";

describe("HomePage Sanity Test", () => {
  it("renders the main heading correctly", () => {
    render(<HomePage />);
    const heading = screen.getByText(/Let's detail your team size/i);
    expect(heading).toBeInTheDocument();
  });
});
