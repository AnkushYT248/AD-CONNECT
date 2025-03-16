export const FullScreenPreloader = () => {
  return (
    <div className="fullScreenPreloader hidden fixed z-[60] h-screen w-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
    </div>
  )
}

export default FullScreenPreloader;