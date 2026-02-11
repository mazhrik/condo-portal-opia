import { BoardLayout } from "@/components/board/BoardLayout";

const BoardPolls = () => {
    return (
        <BoardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-light tracking-tight mb-8">Board Polls</h1>
                <p>Internal board voting.</p>
            </div>
        </BoardLayout>
    );
};

export default BoardPolls;
