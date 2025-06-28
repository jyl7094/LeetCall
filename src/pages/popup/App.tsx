import Header from "@/pages/popup/components/Header";

const App = () => {
  return (
    <div className="w-[350px] flex flex-col antialiased p-2.5">
      <Header />
      {/* {isLeetCode ? <LeetCodeView /> : <NonLeetCodeView />} */}
      <button className="bg-amber-400 rounded-xs w-full">Dashboard</button>
    </div>
  );
};

export default App;
