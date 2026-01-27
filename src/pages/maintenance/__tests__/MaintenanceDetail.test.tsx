import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MaintenanceDetail from "../MaintenanceDetail";
import * as api from "@/utils/api";
import { useMe } from "@/hooks/useMe";

vi.mock("@/utils/api", () => ({
  getMaintenanceRequest: vi.fn(),
  updateMaintenanceRequest: vi.fn(),
}));

vi.mock("@/hooks/useMe", () => ({
  useMe: vi.fn(),
}));

const mockRequest = {
  id: 42,
  resident: 3,
  title: "Leaky faucet",
  description: "Kitchen sink leaking.",
  status: "new",
  priority: "medium",
  assigned_to: null,
  completion_notes: null,
  created_at: "2026-01-23T00:00:00Z",
  updated_at: "2026-01-23T00:00:00Z",
};

const renderDetail = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/maintenance/42"]}>
        <Routes>
          <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("MaintenanceDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows manage controls for manager", async () => {
    (useMe as any).mockReturnValue({
      data: { role: "manager", staff: { id: 1 } },
    });
    (api.getMaintenanceRequest as any).mockResolvedValueOnce(mockRequest);

    renderDetail();

    await waitFor(() => {
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    expect(screen.getByText("Manage request")).toBeInTheDocument();
  });

  it("hides manage controls for resident", async () => {
    (useMe as any).mockReturnValue({
      data: { role: "resident", staff: null },
    });
    (api.getMaintenanceRequest as any).mockResolvedValueOnce(mockRequest);

    renderDetail();

    await waitFor(() => {
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    expect(screen.queryByText("Manage request")).not.toBeInTheDocument();
  });
});
