import { BoardLayout } from "@/components/board/BoardLayout";

const BoardSettings = () => {
    return (
        <BoardLayout>
            <div className="p-8">
                <h1 className="text-3xl font-light tracking-tight mb-8">Board Settings</h1>
                <p>Configuration options.</p>
            </div>
        </BoardLayout>
    );
};

export default BoardSettings;
