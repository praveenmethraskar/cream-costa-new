import RegisterPage from "@/presentation/components/RegisterForm"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Mock next/router
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe("RegisterPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  test("successful registration triggers router push", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "User registered" }),
    })

    render(<RegisterPage />)

    await userEvent.type(screen.getByPlaceholderText("First Name"), "John")
    await userEvent.type(screen.getByPlaceholderText("Last Name"), "Doe")
    await userEvent.type(screen.getByPlaceholderText("Username"), "johndoe")
    await userEvent.type(screen.getByPlaceholderText("Phone"), "1234567890")
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "john@example.com"
    )
    await userEvent.type(screen.getByPlaceholderText("Role"), "user")
    await userEvent.type(screen.getByPlaceholderText("Password"), "pass123")
    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "pass123"
    )

    // Click the submit button specifically
    fireEvent.click(screen.getByRole("button", { name: /Register/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/")
    })
  })

  test("shows error when passwords do not match", async () => {
    render(<RegisterPage />)

    await userEvent.type(screen.getByPlaceholderText("Password"), "pass123")
    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "pass456"
    )

    fireEvent.click(screen.getByRole("button", { name: /Register/i }))

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument()
    })
  })

  test("shows error on failed registration", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Username already exists" }),
    })

    render(<RegisterPage />)

    await userEvent.type(screen.getByPlaceholderText("First Name"), "John")
    await userEvent.type(screen.getByPlaceholderText("Last Name"), "Doe")
    await userEvent.type(screen.getByPlaceholderText("Username"), "johndoe")
    await userEvent.type(screen.getByPlaceholderText("Phone"), "1234567890")
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "john@example.com"
    )
    await userEvent.type(screen.getByPlaceholderText("Role"), "user")
    await userEvent.type(screen.getByPlaceholderText("Password"), "pass123")
    await userEvent.type(
      screen.getByPlaceholderText("Confirm Password"),
      "pass123"
    )

    fireEvent.click(screen.getByRole("button", { name: /Register/i }))

    await waitFor(() => {
      expect(screen.getByText("Username already exists")).toBeInTheDocument()
    })
  })
})