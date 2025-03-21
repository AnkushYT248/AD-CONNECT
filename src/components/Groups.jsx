export const Groups = () => {
  return (
    <>
        <div className="group_container mt-2 p-3 w-full flex flex-row items-center justify-between bg-base-300 rounded-lg md:text-lg text-sm">
        <div className="flex items-center gap-3 justify-center">
          <div className="avatar">
            <div className="w-18 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1>Friend 1</h1>
            <p>Last message</p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <p>07:37/Today</p>
        </div>
      </div>
    </>
  )
}

export default Groups;