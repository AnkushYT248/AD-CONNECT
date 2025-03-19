export const Groups = () => {
  return (
    <>
    <div className="mt-2 p-3 w-full flex flex-row items-center justify-between bg-base-300 rounded-lg  hover:bg-base-200 md:text-lg text-sm">
      <div className="flex items-center gap-3 justify-center">
        <div class="avatar">
          <div class="w-18 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
       <div className="flex flex-col gap-2">
          <h1>Group 1</h1>
          <p>Last message </p>
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