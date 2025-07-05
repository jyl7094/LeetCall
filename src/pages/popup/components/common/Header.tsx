const Header = () => {
  const handleClose = () => {
    window.close();
  };

  return (
    <div className="flex w-full justify-between select-none">
      <div className="flex items-center gap-1.5">
        <img src="/icon128.png" className="pointer-events-none w-5" />
        <h1 className="font-semibold">LeetCall</h1>
      </div>
      <button onClick={handleClose} type="button" className="cursor-pointer">
        ✕
      </button>
    </div>
  );
};

export default Header;
