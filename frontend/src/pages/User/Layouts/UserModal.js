const UserModal = ({children}) => {
    return (
        <>
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="flex flex-col md:w-3/5 w-full max-w-auto h-5/6 max-h-full overflow-y-auto bg-white p-8 relative">
                    {children}
                </div>
            </div>
        </>
    )
}

export default UserModal;