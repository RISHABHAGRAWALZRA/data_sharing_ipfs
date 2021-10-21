import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './drop-file-input.css';

import uploadImg from '../assets/upload.svg';
import { decrypt, fileToData, encrypt, handleFiles } from '../handleFiles';
import { asyncForEach } from '../utils'


const DropFileInput = ({ IPFS, onfileAdded, nodeId }) => {


    const wrapperRef = useRef(null);

    const [progress, setProgress] = useState(0);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');


    let fileSize;
    const updateProgress = (bytesLoaded) => {
        let percent = 100 - ((bytesLoaded / fileSize) * 100)
        setProgress(percent);
        console.log(percent);
    }

    const resetProgress = () => {
        setProgress(0);
    }

    const appendFileData = (data) => {
        console.log("appendFileData Called");
        onfileAdded(data);
    }

    const onFileDrop = async (e) => {
        const files = Array.from(e.target.files);
        const operation = await handleFiles(files);
        if (operation == "encrypt") {
            await asyncForEach(files, async file => {

                //Conveting file into base64
                const data = await fileToData(file);
                //Encrypting
                const encryptedData = await encrypt(data, file.name, nodeId);
                //Setting fileSize for progressBar
                fileSize = encryptedData.size;

                //Adding Files to ipfs
                const fileAdded = await IPFS.add({
                    path: encryptedData.name,
                    content: encryptedData.file
                }, {
                    progress: updateProgress
                })
                
                //reset progressBar
                resetProgress();
                //Appending File to fileList
                appendFileData({ "name": file.name, "cid": fileAdded.cid.toString(), "size": fileSize });
                // Returned by ipfs
                console.log(fileAdded);
            });
        } else {
            console.log("Not for encryption");
        }
    }


    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Drag &amp; Drop your files here</p>
                </div>
                <input type="file" value="" onChange={onFileDrop} />
            </div>

            <div className="progress-container">
                <progress className="progress-bar" value={100-progress} max={100} />
            </div>

            {/* <div className="progress-bar" translateX={progress}></div> */}

        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;
