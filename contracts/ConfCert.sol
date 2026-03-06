// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConfCert {

    struct Certificate {
        uint certId;
        string studentName;
        string ipfsHash;
    }

    uint public nextCertId;
    mapping(uint => Certificate) public certificates;

    event CertificateIssued(
        uint certId,
        string studentName,
        string ipfsHash
    );

    constructor() {
        nextCertId = 1000;
    }

    function issueCertificate(
        string memory _studentName,
        string memory _ipfsHash
    ) public {
        nextCertId++;

        certificates[nextCertId] = Certificate(
            nextCertId,
            _studentName,
            _ipfsHash
        );

        emit CertificateIssued(
            nextCertId,
            _studentName,
            _ipfsHash
        );
    }

    function getCertificate(uint _certId)
        public
        view
        returns (string memory, string memory)
    {
        Certificate memory cert = certificates[_certId];
        return (cert.studentName, cert.ipfsHash);
    }
}
