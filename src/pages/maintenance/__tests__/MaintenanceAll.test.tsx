import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import MaintenanceAll from "../MaintenanceAll";
import * as api from "@/utils/api";
import { useMe } from "@/hooks/useMe";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/utils/api", () => ({
  getMaintenanceRequests: vi.fn(),
}));

vi.mock("@/hooks/useMe", () => ({
  useMe: vi.fn(),
}));

const mockRequest = {
  id: 101,
  resident: 7,
  title: "Leaky faucet",
  description: "Kitchen sink leaking.",
  status: "new",
  priority: "medium",
  assigned_to: null,
  completion_notes: null,
  created_at: "2026-01-23T00:00:00Z",
  updated_at: "2026-01-23T00:00:00Z",
};

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MaintenanceAll />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("MaintenanceAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to detail when clicking Manage", async () => {
    (useMe as any).mockReturnValue({
      data: { role: "manager" },
      isLoading: false,
    });
    (api.getMaintenanceRequests as any).mockResolvedValueOnce({
      count: 1,
      next: null,
      previous: null,
      results: [mockRequest],
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByText(mockRequest.title)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Manage" }));
    expect(mockNavigate).toHaveBeenCalledWith(`/maintenance/${mockRequest.id}`);
  });
});
