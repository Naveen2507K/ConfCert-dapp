let web3;
let contract;


const CONTRACT_ADDRESS = "0xf7dcb2F36B5bb493a232DED350e8f336C5E94C51";
const ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "certId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "CertificateIssued",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "certificates",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "certId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "studentName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "nextCertId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_studentName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "issueCertificate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_certId",
          "type": "uint256"
        }
      ],
      "name": "getCertificate",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
];

window.onload = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    console.log("MetaMask connected");
  } else {
    alert("Please install MetaMask");
  }
};

// async function issueCert() {
  // const name = document.getElementById("name").value;
  // const cid = document.getElementById("cid").value;
  // const accounts = await web3.eth.getAccounts();


  // await contract.methods.issueCertificate(name, cid)
  // .send({ from: accounts[0] });


  // document.getElementById("issueResult").innerText = "Certificate Issued Successfully";
// }

async function uploadCertificate() {
  const fileInput = document.getElementById("certificateFile");
  const studentName = document.getElementById("studentName").value;

  if (!fileInput.files.length || !studentName) {
    alert("Enter name and upload PDF");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        pinata_api_key: "790feed0b47084803bf9",
        pinata_secret_api_key: "82691ab7aadaf490c08943eca26b608eaa188d88d81712b544c580324374bcbf"
      },
      body: formData
    }
  );

  const data = await response.json();
  const cid = data.IpfsHash;

  console.log("Uploaded to IPFS:", cid);

  await issueCertificate(studentName, cid);
}

// async function verifyCert() {
// const id = document.getElementById("certId").value;


// const result = await contract.methods.getCertificate(id).call();


// document.getElementById("verifyResult").innerHTML =
// `Name: ${result.name}<br>
// IPFS: <a href="https://ipfs.io/ipfs/${result.cid}" target="_blank">View Certificate</a>`;
// }

async function issueCertificate(name, cid) {
  const accounts = await web3.eth.getAccounts();

  await contract.methods
    .issueCertificate(name, cid)
    .send({ from: accounts[0] });

  document.getElementById("issueResult").innerText =
    "Certificate issued successfully!";
  
  // document.getElementById("CertificateId").innerHTML = 
  // <p><b>Student Name:</b> ${studentName}</p>
}

async function verifyCertificate() {
  const certId = document.getElementById("certId").value;

  const cert = await contract.methods
    .getCertificate(certId)
    .call();

  const studentName = cert[0];
  const ipfsHash = cert[1];

  document.getElementById("verifyResult").innerHTML = `
    <p><b>Student Name:</b> ${studentName}</p>
    <a href="https://gateway.pinata.cloud/ipfs/${ipfsHash}" target="_blank">
      View Certificate PDF
    </a>
  `;
}