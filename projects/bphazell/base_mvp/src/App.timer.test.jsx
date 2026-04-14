import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import App from "./App";

vi.mock("./components/QuestionTimer.jsx", () => ({
  default: function MockQuestionTimer({ onTimeout, questionKey }) {
    useEffect(() => {
      if (String(questionKey).endsWith("-0")) {
        onTimeout();
      }
    }, [questionKey, onTimeout]);
    return (
      <p className="timer">
        Time left: <strong>0s</strong>
      </p>
    );
  },
}));

describe("Quick Quiz Blitz (timer)", () => {
  it("marks the first question incorrect when time runs out and continues the quiz", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "General" }));
    await user.click(screen.getByRole("button", { name: "Start Quiz" }));

    expect(screen.getByText("Question 2 of 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "60" }));
    await user.click(screen.getByRole("button", { name: "Next Question" }));

    await user.click(screen.getByRole("button", { name: "63" }));
    await user.click(screen.getByRole("button", { name: "Finish Quiz" }));

    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    const review = screen.getByRole("heading", { name: "Answer Review" }).closest("section");
    expect(review).not.toBeNull();
    expect(within(review).getByText("No answer (time ran out)")).toBeInTheDocument();
  });
});
