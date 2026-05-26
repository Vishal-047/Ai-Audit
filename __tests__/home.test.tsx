import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";

describe("HomePage Sanity Test", () => {
  it("renders the main heading correctly", () => {
    render(<HomePage />);
    const heading = screen.getByText(/AI-Powered Security Auditing/i);
    expect(heading).toBeInTheDocument();
  });
});
