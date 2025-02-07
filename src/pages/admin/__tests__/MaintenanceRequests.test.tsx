import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MaintenanceRequests from '../MaintenanceRequests';
import * as api from '@/utils/api';

// Mock the API calls
vi.mock('@/utils/api', () => ({
  getMaintenanceRequests: vi.fn(),
  updateMaintenanceStatus: vi.fn(),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MaintenanceRequests />
    </QueryClientProvider>
  );
};

describe('MaintenanceRequests Admin Component', () => {
  it('renders the maintenance requests page', () => {
    renderComponent();
    expect(screen.getByText('Maintenance Requests')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderComponent();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows maintenance requests when data is loaded', async () => {
    const mockRequests = [
      {
        id: 1,
        title: 'Fix Leaky Faucet',
        status: 'pending',
        priority: 'high',
        resident_name: 'John Doe',
        created_at: '2024-01-01',
      },
    ];

    (api.getMaintenanceRequests as any).mockResolvedValueOnce(mockRequests);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Fix Leaky Faucet')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('allows filtering requests through search', async () => {
    const mockRequests = [
      {
        id: 1,
        title: 'Fix Leaky Faucet',
        status: 'pending',
        priority: 'high',
        resident_name: 'John Doe',
        created_at: '2024-01-01',
      },
      {
        id: 2,
        title: 'Broken Window',
        status: 'in_progress',
        priority: 'medium',
        resident_name: 'Jane Smith',
        created_at: '2024-01-02',
      },
    ];

    (api.getMaintenanceRequests as any).mockResolvedValueOnce(mockRequests);

    renderComponent();

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search requests...');
      fireEvent.change(searchInput, { target: { value: 'Leaky' } });
      
      expect(screen.getByText('Fix Leaky Faucet')).toBeInTheDocument();
      expect(screen.queryByText('Broken Window')).not.toBeInTheDocument();
    });
  });

  it('allows updating request status', async () => {
    const mockRequests = [
      {
        id: 1,
        title: 'Fix Leaky Faucet',
        status: 'pending',
        priority: 'high',
        resident_name: 'John Doe',
        created_at: '2024-01-01',
      },
    ];

    (api.getMaintenanceRequests as any).mockResolvedValueOnce(mockRequests);
    (api.updateMaintenanceStatus as any).mockResolvedValueOnce({ ...mockRequests[0], status: 'in_progress' });

    renderComponent();

    await waitFor(() => {
      const statusSelect = screen.getByRole('combobox');
      fireEvent.change(statusSelect, { target: { value: 'in_progress' } });
      
      expect(api.updateMaintenanceStatus).toHaveBeenCalledWith(1, 'in_progress');
    });
  });

  it('handles API errors gracefully', async () => {
    (api.getMaintenanceRequests as any).mockRejectedValueOnce(new Error('Failed to fetch'));

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});