import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Quick Quiz Blitz", () => {
  it("completes a category with correct answers and shows score and review", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "General" }));
    await user.click(screen.getByRole("button", { name: "Start Quiz" }));

    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mars" }));
    await user.click(screen.getByRole("button", { name: "Next Question" }));

    await user.click(screen.getByRole("button", { name: "60" }));
    await user.click(screen.getByRole("button", { name: "Next Question" }));

    await user.click(screen.getByRole("button", { name: "63" }));
    await user.click(screen.getByRole("button", { name: "Finish Quiz" }));

    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Answer Review" })).toBeInTheDocument();

    const review = screen.getByRole("heading", { name: "Answer Review" }).closest("section");
    expect(review).not.toBeNull();
    expect(within(review).getAllByText("Correct")).toHaveLength(3);
  });

  it("resets with Play Again and returns to the category picker with Change Category", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Tech" }));
    await user.click(screen.getByRole("button", { name: "Start Quiz" }));

    await user.click(screen.getByRole("button", { name: "Cascading Style Sheets" }));
    await user.click(screen.getByRole("button", { name: "Next Question" }));

    await user.click(screen.getByRole("button", { name: "JavaScript" }));
    await user.click(screen.getByRole("button", { name: "Next Question" }));

    await user.click(screen.getByRole("button", { name: "Meta" }));
    await user.click(screen.getByRole("button", { name: "Finish Quiz" }));

    expect(screen.getByText("3 / 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Play Again" }));
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next Question" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Cascading Style Sheets" }));
    await user.click(screen.getByRole("button", { name: "Next Question" }));

    await user.click(screen.getByRole("button", { name: "JavaScript" }));
    await user.click(screen.getByRole("button", { name: "Next Question" }));

    await user.click(screen.getByRole("button", { name: "Meta" }));
    await user.click(screen.getByRole("button", { name: "Finish Quiz" }));

    expect(screen.getByText("3 / 3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Change Category" }));
    expect(screen.getByText("Choose a category before you start.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tech" })).toHaveClass("selected");
    expect(screen.getByRole("button", { name: "Start Quiz" })).toBeEnabled();
  });
});
