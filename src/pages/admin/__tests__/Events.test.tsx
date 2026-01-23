import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Events from '../Events';
import * as api from '@/utils/api';

// Mock the API calls
vi.mock('@/utils/api', () => ({
    getEvents: vi.fn(),
    createEvent: vi.fn(),
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
            <Events />
        </QueryClientProvider>
    );
};

describe('Admin Events Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('renders the events page', () => {
        (api.getEvents as any).mockResolvedValueOnce([]);
        renderComponent();
        expect(screen.getByText('Events Calendar')).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
        (api.getEvents as any).mockImplementation(() => new Promise(() => { }));
        renderComponent();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('shows events when data is loaded', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Summer BBQ',
                description: 'Annual community BBQ event',
                date: '2024-07-15T18:00:00Z',
                location: 'Pool Area',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            },
        ];

        (api.getEvents as any).mockResolvedValueOnce(mockEvents);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Summer BBQ')).toBeInTheDocument();
            expect(screen.getByText(/Pool Area/i)).toBeInTheDocument();
        });
    });

    it('allows creating a new event', async () => {
        (api.getEvents as any).mockResolvedValueOnce([]);
        (api.createEvent as any).mockResolvedValueOnce({
            id: 2,
            title: 'New Event',
            description: 'Test event',
            date: '2024-08-01T18:00:00Z',
            location: 'Clubhouse',
            is_active: true,
        });

        renderComponent();

        // Wait for initial load
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        // Open create dialog
        const createButton = screen.getByText(/Create New Event/i);
        fireEvent.click(createButton);

        // Fill in the form
        const titleInput = screen.getByPlaceholderText(/event title/i);
        const descriptionInput = screen.getByPlaceholderText(/event description/i);
        const locationInput = screen.getByPlaceholderText(/location/i);

        fireEvent.change(titleInput, { target: { value: 'New Event' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test event' } });
        fireEvent.change(locationInput, { target: { value: 'Clubhouse' } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /create event/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.createEvent).toHaveBeenCalled();
        });
    });

    it('displays event details', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Summer BBQ',
                description: 'Annual community BBQ event',
                date: '2024-07-15T18:00:00Z',
                location: 'Pool Area',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            },
        ];

        (api.getEvents as any).mockResolvedValueOnce(mockEvents);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Summer BBQ')).toBeInTheDocument();
            expect(screen.getByText(/Annual community BBQ event/i)).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        (api.getEvents as any).mockRejectedValueOnce(new Error('Failed to fetch'));

        renderComponent();

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('filters active events', async () => {
        const mockEvents = [
            {
                id: 1,
                title: 'Active Event',
                description: 'This is active',
                date: '2024-07-15T18:00:00Z',
                location: 'Pool',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
            },
            {
                id: 2,
                title: 'Inactive Event',
                description: 'This is inactive',
                date: '2024-07-20T18:00:00Z',
                location: 'Gym',
                is_active: false,
                created_at: '2024-01-01T00:00:00Z',
            },
        ];

        (api.getEvents as any).mockResolvedValueOnce(mockEvents);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Active Event')).toBeInTheDocument();
        });
    });
});
