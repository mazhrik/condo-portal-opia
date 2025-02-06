
const Index = () => {
  return (
    <div className="min-h-screen relative">
      <div className="app-background" />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6 animate-fade-up">Welcome to Your Luxury Living Space</h1>
          <p className="text-xl text-gray-200 mb-8 animate-fade-up">Experience modern living at its finest</p>
          <div className="space-x-4">
            <a 
              href="/resident" 
              className="btn-gradient text-white px-8 py-3 rounded-lg inline-block transition-all duration-300 hover:scale-105"
            >
              Resident Portal
            </a>
            <a 
              href="/maintenance-requests" 
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-lg inline-block transition-all duration-300 hover:bg-white/20"
            >
              Maintenance Requests
            </a>
            <a 
              href="/admin" 
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-lg inline-block transition-all duration-300 hover:bg-white/20"
            >
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
