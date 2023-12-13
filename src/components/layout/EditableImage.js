import Image from "next/image";
import toast from "react-hot-toast";

const EditableImage = ({ link, setLink }) => {

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files?.length === 1) {
            const data = new FormData;
            data.set('file', files[0]);

            //METHOD 3 
            await toast.promise(fetch('/api/upload', {
                method: 'POST',
                body: data
            }).then(response => {
                if (response.ok) {
                    return response.json().then(link => {
                        setLink(link);
                    })
                }
                throw new Error('Something went wrong')
            }), {
                loading: 'Uploading...',
                success: 'Upload successful!',
                error: 'Failed to upload file'
            });

            //METHOD 1
            // const uploadPromise = new Promise(async (resolve, reject) => {
            //     const response = await fetch('/api/upload', {
            //         method: 'POST',
            //         body: data
            //     });
            //     if (response.ok) {
            //         const link = await response.json();
            //         setImage(link);
            //         resolve();
            //     } else {
            //         reject();
            //     }
            // });

            //METHOD 2
            // const uploadPromise = fetch('/api/upload', {
            //     method: 'POST',
            //     body: data
            // }).then(response => {
            //     if (response.ok) {
            //         return response.json().then(link => {
            //             setImage(link);
            //         })
            //     }
            //     throw new Error('Something went wrong')
            // })

            // await toast.promise(uploadPromise, {
            //     loading: 'Uploading...',
            //     success: 'Upload successful!',
            //     error: 'Failed to upload file'
            // })

        };
    };

    return (
        <>
            {link && <Image src={link} className='rounded-lg w-full h-full mb-1' width={250} height={250} alt='avatar' />}
            {!link && (
                <div className="bg-gray-200 p-4 text-gray-500 rounded-lg mb-3 text-center">
                    No image
                </div>
            )}
            <label>
                <input type="file" className='hidden' onChange={handleFileChange} />
                <span className='block text-center border border-gray-300 cursor-pointer rounded-lg p-2'>Edit</span>
            </label>
        </>
    )
}

export default EditableImage;