import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Polls from '../Polls';
import * as api from '@/utils/api';

// Mock the API calls
vi.mock('@/utils/api', () => ({
    getPolls: vi.fn(),
    votePoll: vi.fn(),
    getNotifications: vi.fn().mockResolvedValue([]),
    markNotificationAsRead: vi.fn(),
    markAllNotificationsAsRead: vi.fn(),
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

import { MemoryRouter } from 'react-router-dom';

const renderComponent = () => {
    return render(
        <MemoryRouter>
            <QueryClientProvider client={queryClient}>
                <Polls />
            </QueryClientProvider>
        </MemoryRouter>
    );
};

describe('Resident Polls Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('renders the polls page', () => {
        (api.getPolls as any).mockResolvedValueOnce([]);
        renderComponent();
        expect(screen.getByText('Polls & Voting')).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
        (api.getPolls as any).mockImplementation(() => new Promise(() => { }));
        renderComponent();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('shows active polls when data is loaded', async () => {
        const mockPolls = [
            {
                id: 1,
                question: 'Should we renovate the pool?',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                options: [
                    { id: 1, text: 'Yes', poll: 1 },
                    { id: 2, text: 'No', poll: 1 },
                ],
            },
        ];

        (api.getPolls as any).mockResolvedValueOnce(mockPolls);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Should we renovate the pool?')).toBeInTheDocument();
        });
    });

    it('displays poll options for voting', async () => {
        const mockPolls = [
            {
                id: 1,
                question: 'Should we renovate the pool?',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                options: [
                    { id: 1, text: 'Yes', poll: 1 },
                    { id: 2, text: 'No', poll: 1 },
                ],
            },
        ];

        (api.getPolls as any).mockResolvedValueOnce(mockPolls);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Yes')).toBeInTheDocument();
            expect(screen.getByText('No')).toBeInTheDocument();
        });
    });

    it('allows voting on a poll', async () => {
        const mockPolls = [
            {
                id: 1,
                question: 'Should we renovate the pool?',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                options: [
                    { id: 1, text: 'Yes', poll: 1 },
                    { id: 2, text: 'No', poll: 1 },
                ],
            },
        ];

        (api.getPolls as any).mockResolvedValueOnce(mockPolls);
        (api.votePoll as any).mockResolvedValueOnce({ message: 'Vote recorded successfully' });

        renderComponent();

        await waitFor(() => {
            const yesButton = screen.getByRole('button', { name: /yes/i });
            fireEvent.click(yesButton);
        });

        await waitFor(() => {
            expect(api.votePoll).toHaveBeenCalledWith(1, 1);
        });
    });

    it('shows error when voting fails', async () => {
        const mockPolls = [
            {
                id: 1,
                question: 'Should we renovate the pool?',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                options: [
                    { id: 1, text: 'Yes', poll: 1 },
                    { id: 2, text: 'No', poll: 1 },
                ],
            },
        ];

        (api.getPolls as any).mockResolvedValueOnce(mockPolls);
        (api.votePoll as any).mockRejectedValueOnce(new Error('You have already voted'));

        renderComponent();

        await waitFor(() => {
            const yesButton = screen.getByRole('button', { name: /yes/i });
            fireEvent.click(yesButton);
        });

        await waitFor(() => {
            expect(api.votePoll).toHaveBeenCalled();
        });
    });

    it('handles API errors gracefully', async () => {
        (api.getPolls as any).mockRejectedValueOnce(new Error('Failed to fetch'));

        renderComponent();

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('displays poll question and description', async () => {
        const mockPolls = [
            {
                id: 1,
                question: 'Should we renovate the pool?',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                options: [
                    { id: 1, text: 'Yes', poll: 1 },
                    { id: 2, text: 'No', poll: 1 },
                ],
            },
        ];

        (api.getPolls as any).mockResolvedValueOnce(mockPolls);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Should we renovate the pool?')).toBeInTheDocument();
        });
    });

    it('only shows active polls', async () => {
        const mockPolls = [
            {
                id: 1,
                question: 'Active Poll',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                options: [
                    { id: 1, text: 'Option 1', poll: 1 },
                ],
            },
            {
                id: 2,
                question: 'Inactive Poll',
                is_active: false,
                created_at: '2024-01-01T00:00:00Z',
                options: [
                    { id: 2, text: 'Option 2', poll: 2 },
                ],
            },
        ];

        (api.getPolls as any).mockResolvedValueOnce(mockPolls);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Active Poll')).toBeInTheDocument();
            expect(screen.queryByText('Inactive Poll')).not.toBeInTheDocument();
        });
    });
});
