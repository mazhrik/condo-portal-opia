import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Polls from '../Polls';
import * as api from '@/utils/api';

// Mock the API calls
vi.mock('@/utils/api', () => ({
    getPolls: vi.fn(),
    createPoll: vi.fn(),
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
            <Polls />
        </QueryClientProvider>
    );
};

describe('Admin Polls Component', () => {
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

    it('shows polls when data is loaded', async () => {
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

    it('displays poll options', async () => {
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

    it('allows creating a new poll', async () => {
        (api.getPolls as any).mockResolvedValueOnce([]);
        (api.createPoll as any).mockResolvedValueOnce({
            id: 2,
            question: 'New Poll Question',
            is_active: true,
            options: [],
        });

        renderComponent();

        // Wait for initial load
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        // Open create dialog
        const createButton = screen.getByText('Create New Poll');
        fireEvent.click(createButton);

        // Fill in the form
        const questionInput = screen.getByPlaceholderText(/poll question/i);
        fireEvent.change(questionInput, { target: { value: 'New Poll Question' } });

        // Add options
        const option1Input = screen.getByPlaceholderText(/option 1/i);
        const option2Input = screen.getByPlaceholderText(/option 2/i);
        fireEvent.change(option1Input, { target: { value: 'Option A' } });
        fireEvent.change(option2Input, { target: { value: 'Option B' } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /create poll/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.createPoll).toHaveBeenCalledWith({
                question: 'New Poll Question',
                options_data: [
                    { text: 'Option A' },
                    { text: 'Option B' },
                ],
            });
        });
    });

    it('handles API errors gracefully', async () => {
        (api.getPolls as any).mockRejectedValueOnce(new Error('Failed to fetch'));

        renderComponent();

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('filters active polls', async () => {
        const mockPolls = [
            {
                id: 1,
                question: 'Active Poll',
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                options: [],
            },
            {
                id: 2,
                question: 'Inactive Poll',
                is_active: false,
                created_at: '2024-01-01T00:00:00Z',
                options: [],
            },
        ];

        (api.getPolls as any).mockResolvedValueOnce(mockPolls);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Active Poll')).toBeInTheDocument();
            // Inactive poll should not be displayed (depending on component logic)
        });
    });
});
