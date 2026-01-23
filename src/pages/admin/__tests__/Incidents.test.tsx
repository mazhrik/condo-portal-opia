import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Incidents from '../Incidents';
import * as api from '@/utils/api';

// Mock the API calls
vi.mock('@/utils/api', () => ({
    getIncidents: vi.fn(),
    updateIncidentStatus: vi.fn(),
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
            <Incidents />
        </QueryClientProvider>
    );
};

describe('Admin Incidents Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('renders the incidents page', () => {
        (api.getIncidents as any).mockResolvedValueOnce([]);
        renderComponent();
        expect(screen.getByText('Incident Reports')).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
        (api.getIncidents as any).mockImplementation(() => new Promise(() => { }));
        renderComponent();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('shows incidents when data is loaded', async () => {
        const mockIncidents = [
            {
                id: 1,
                title: 'Broken Window',
                description: 'Window in lobby is cracked',
                location: 'Main Lobby',
                status: 'open',
                created_at: '2024-01-01T00:00:00Z',
                resident_name: 'John Doe',
            },
        ];

        (api.getIncidents as any).mockResolvedValueOnce(mockIncidents);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Broken Window')).toBeInTheDocument();
            expect(screen.getByText(/Main Lobby/i)).toBeInTheDocument();
        });
    });

    it('allows filtering incidents by status', async () => {
        const mockIncidents = [
            {
                id: 1,
                title: 'Open Incident',
                description: 'This is open',
                location: 'Lobby',
                status: 'open',
                created_at: '2024-01-01T00:00:00Z',
                resident_name: 'John Doe',
            },
            {
                id: 2,
                title: 'Resolved Incident',
                description: 'This is resolved',
                location: 'Gym',
                status: 'resolved',
                created_at: '2024-01-02T00:00:00Z',
                resident_name: 'Jane Smith',
            },
        ];

        (api.getIncidents as any).mockResolvedValueOnce(mockIncidents);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Open Incident')).toBeInTheDocument();
            expect(screen.getByText('Resolved Incident')).toBeInTheDocument();
        });

        // Filter by status
        const statusFilter = screen.getByRole('combobox');
        fireEvent.change(statusFilter, { target: { value: 'open' } });

        await waitFor(() => {
            expect(screen.getByText('Open Incident')).toBeInTheDocument();
        });
    });

    it('allows updating incident status', async () => {
        const mockIncidents = [
            {
                id: 1,
                title: 'Broken Window',
                description: 'Window in lobby is cracked',
                location: 'Main Lobby',
                status: 'open',
                created_at: '2024-01-01T00:00:00Z',
                resident_name: 'John Doe',
            },
        ];

        (api.getIncidents as any).mockResolvedValueOnce(mockIncidents);
        (api.updateIncidentStatus as any).mockResolvedValueOnce({
            ...mockIncidents[0],
            status: 'investigating',
        });

        renderComponent();

        await waitFor(() => {
            const statusSelect = screen.getAllByRole('combobox')[0];
            fireEvent.change(statusSelect, { target: { value: 'investigating' } });

            expect(api.updateIncidentStatus).toHaveBeenCalledWith(1, 'investigating');
        });
    });

    it('displays incident details', async () => {
        const mockIncidents = [
            {
                id: 1,
                title: 'Broken Window',
                description: 'Window in lobby is cracked',
                location: 'Main Lobby',
                status: 'open',
                created_at: '2024-01-01T00:00:00Z',
                resident_name: 'John Doe',
            },
        ];

        (api.getIncidents as any).mockResolvedValueOnce(mockIncidents);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Broken Window')).toBeInTheDocument();
            expect(screen.getByText(/Window in lobby is cracked/i)).toBeInTheDocument();
            expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        (api.getIncidents as any).mockRejectedValueOnce(new Error('Failed to fetch'));

        renderComponent();

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('allows searching incidents', async () => {
        const mockIncidents = [
            {
                id: 1,
                title: 'Broken Window',
                description: 'Window in lobby is cracked',
                location: 'Main Lobby',
                status: 'open',
                created_at: '2024-01-01T00:00:00Z',
                resident_name: 'John Doe',
            },
            {
                id: 2,
                title: 'Leaky Pipe',
                description: 'Pipe is leaking',
                location: 'Basement',
                status: 'open',
                created_at: '2024-01-02T00:00:00Z',
                resident_name: 'Jane Smith',
            },
        ];

        (api.getIncidents as any).mockResolvedValueOnce(mockIncidents);

        renderComponent();

        await waitFor(() => {
            const searchInput = screen.getByPlaceholderText(/search/i);
            fireEvent.change(searchInput, { target: { value: 'Window' } });

            expect(screen.getByText('Broken Window')).toBeInTheDocument();
            expect(screen.queryByText('Leaky Pipe')).not.toBeInTheDocument();
        });
    });
});
