import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Maintenance from '../Maintenance';
import * as api from '@/utils/api';

// Mock the API calls
vi.mock('@/utils/api', () => ({
  getMaintenanceRequests: vi.fn(),
  createMaintenanceRequest: vi.fn(),
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
      <Maintenance />
    </QueryClientProvider>
  );
};

describe('Maintenance Component', () => {
  it('renders the maintenance page', () => {
    renderComponent();
    expect(screen.getByText('Maintenance Requests')).toBeInTheDocument();
    expect(screen.getByText('Submit and track your maintenance requests')).toBeInTheDocument();
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
        description: 'The kitchen faucet is leaking',
        status: 'pending',
      },
    ];

    (api.getMaintenanceRequests as any).mockResolvedValueOnce(mockRequests);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Fix Leaky Faucet')).toBeInTheDocument();
      expect(screen.getByText('The kitchen faucet is leaking')).toBeInTheDocument();
    });
  });

  it('allows submitting a new maintenance request', async () => {
    const mockCreateRequest = {
      id: 2,
      title: 'New Request',
      description: 'Test description',
      status: 'pending',
    };

    (api.createMaintenanceRequest as any).mockResolvedValueOnce(mockCreateRequest);

    renderComponent();

    // Open the dialog
    const submitButton = screen.getByText('Submit New Request');
    fireEvent.click(submitButton);

    // Fill the form
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionInput = screen.getByPlaceholderText('Description');

    fireEvent.change(titleInput, { target: { value: 'New Request' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    // Submit the form
    const submitFormButton = screen.getByRole('button', { name: 'Submit Request' });
    fireEvent.click(submitFormButton);

    await waitFor(() => {
      expect(api.createMaintenanceRequest).toHaveBeenCalledWith({
        title: 'New Request',
        description: 'Test description',
        status: 'pending',
        priority: 'medium',
      });
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