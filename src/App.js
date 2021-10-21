import logoIpfs from './assets/ipfs-logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import DropFileInput from './components/DropFileInput';

import * as IPFS from 'ipfs-core'
import JSZip from "jszip";
import { concat } from 'uint8arrays/concat';

import { decrypt } from './utility/handleFiles';
import { b64toBlob } from './utility/utils';
const all = require('it-all')
const toBuffer = require('it-to-buffer')

function App() {
  const [ipfs, setIPFS] = useState('null');
  const [nodeId, setIpfsNodeId] = useState('null');
  const [addresses, setAddress] = useState('null');
  const [cid, setCid] = useState('null');
  const [eKey,setEKey] = useState('null');
  const [fileList, setfileList] = useState([]);

  async function initializeDeamon() {
    const ipfs = await IPFS.create();
    setIPFS(ipfs);
    const nodeId = await ipfs.id();
    setIpfsNodeId(nodeId.id);
    let fetchedAddresses = await nodeId.addresses.map((address) => {
      return `<li><pre>${address}</pre></li>`
    }).join('')
    if (fetchedAddresses == "") fetchedAddresses = "None";
    setAddress(fetchedAddresses);
    console.log(ipfs);
    console.log(nodeId);
    console.log(fetchedAddresses);
  }

  useEffect(() => {
    if (nodeId == 'null') initializeDeamon();
  }, []);

  const onFileAdded = async (data) => {
    console.log("onFileAdded Called");
    setfileList(current => [...current, data]);
    fileList.forEach(element => {
      console.log(element);
    });
  }

  const FileListItems = fileList.map((file) => {
    <tr key={file}>
      <td>{file.name}</td>
      <td>{file.cid}</td>
      <td>{file.size}</td>
    </tr>
  });

  /* const getFile = async () => {
    console.log("getFile clicked");
  } */


  const getFile = async () => {

    const hash = cid;

    console.log(cid);

    if (!hash) {
      return console.log("Error : no id");
    }

    const content = concat(await all(await ipfs.cat(hash)));
    console.log(content);

    /* for await (const chunk of ipfs.cat(hash)) {
      console.log(chunk);
      data = chunk;
    } */

    /* const stream = ipfs.cat(hash);
    let data = ''
    for await (const chunk of stream) {
      data += chunk.toString()
    }
    console.log(data) */

    /* const fileContents = await toBuffer(ipfs.cat(hash))
    const data = fileContents.toString()
    console.log(data); */

    const decryptedData = await decrypt(content, eKey);
    console.log(decryptedData);
    //onFileAdded({ "name": decryptedData.name, "cid": hash, "size": "2222" })
  }


  return (
    <div className="App">
      <header>
        <img width="200" src={logoIpfs} alt="IPFS" />
      </header>

      <main>
        <div class="box node">
          <h2>Node</h2>
          <div>
            <h3>KEY</h3>
            <h3>{nodeId ? nodeId : <pre id="logs">Fetching.....</pre>}</h3>
            <pre class="node-id"></pre>
          </div>

          <div>
            <h3>Addresses</h3>
            <h3>{addresses ? addresses : <pre id="logs">None.....</pre>}</h3>
            <ul class="node-addresses"></ul>
          </div>
        </div>

        <div className="upload">
          <DropFileInput
            IPFS={ipfs}
            onfileAdded={onFileAdded}
            nodeId={nodeId}
          />
        </div>



        <div class="columns">
          <div id="files" class="box" ondragover="event.preventDefault()">
            <h2>Files</h2>

            <div class="input-button">
              <input id="cid-input" onChange={(e) => { setEKey(e.target.value) }} type="text" placeholder="KEY" />
            </div>
            <div class="input-button">
              <input id="cid-input" onChange={(e) => { setCid(e.target.value) }} type="text" placeholder="CID" />
              <button onClick={getFile} id="fetch-btn" type="button">Fetch</button>
            </div>

            <table id="file-history">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>CID</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {fileList.length>0 ? fileList.map(file =>
                  <tr key={file}>
                    <td>{file.name}</td>
                    <td>{file.cid}</td>
                    <td>{file.size}</td>
                  </tr>
                ) : <tr class="empty-row">
                  <td colspan="4">There are no files in this workspace.</td>
                </tr>}
              </tbody>
            </table>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
