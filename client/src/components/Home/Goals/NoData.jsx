const NoData = ({ title, content }) => {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-center">
                <p className="text-lg font-semibold">{title}</p>
                <p className="text-sm mt-2">{content}</p>
                <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700">
                    Hedef Ekle
                </button>
            </div>
        </div>
    )
}

export default NoData