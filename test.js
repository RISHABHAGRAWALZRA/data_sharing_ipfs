const getFile = async () => {

    const hash = cid;
    
    console.log(cid);

    if (!hash) {
      return console.log("Error : no id");
    }

    const ipfsPath = "QmWXdjNC362aPDtwHPUE9o2VMqPeNeCQuTBTv1NsKtwypg"; // text file in folder
    const id = 'Qmegw7TLhgkTMKQNeNrngsxFueepAuwUYXKmZHQutEoe7D' // Encrypted file
    const ipfsPath2 = "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A" // text file direct;


    /* for await (const chunk of ipfs.cat(ipfsPath)) {
      console.info(chunk)
    } */

    /* for await (const buf of ipfs.get(id)) {
      const blob = new Blob([buf]);
      console.log(blob);
    } */

    /* for await (const file of ipfs.ls(id)) {
      if (file.content) {
        console.log(file.content);
        const content = uint8ArrayConcat(await all(file.content))
        console.log(content);
      }
    } */

    let path = "";
    for await (const file of ipfs.ls(id)) {
      console.log(file.path)
      path = file.path;
    }

    /* const stream = ipfs.cat(path);
    let data = ''

    for await (const chunk of stream) {
      // chunks of data are returned as a Buffer, convert it back to a string
      data += chunk.toString()
    }

    console.log(data) */

    const fileContents = await toBuffer(ipfs.cat(path))
    const message = fileContents.toString()

    console.log(message);

    console.log("start");
    const blob = new Blob([message]);
    var file = new File([blob], "x.text");
    console.log(file);
    var fr = new FileReader();
    fr.onload = function () {
      console.log(fr.result);
    }
    fr.readAsText(file)
    console.log("End");

  }

