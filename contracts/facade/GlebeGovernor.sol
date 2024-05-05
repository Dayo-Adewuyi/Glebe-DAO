// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

interface IGlebeEstate {
    function listAsset(address _owner, uint256 _amount, uint256 _price, string calldata _uri, 
        string calldata _description,
        string calldata _location) external returns (uint256);
    function distributeDividends(uint256 _tokenId, uint256 _totalAmount) external;
}

interface IERC20{
     function balanceOf(address account) external view returns (uint256);
}

contract GlebeGovernor {
    enum ProposalStatus { Pending, Approved, Rejected }

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        ProposalStatus status;
        uint256 price;
        uint256 shares;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 creationTime;
        uint256 endTime;
        uint256 tokenId; 
        string uri;
        string location;
    }

    struct AssetData {
        uint256 revenue;
        uint256 dividends;
    }

    Proposal[] public proposals;
    mapping(address => bool) public voters;
    mapping(uint256 => AssetData) public assetData;
    mapping(address => bool ) private admins;
    address GlebeToken;
    address glebeEstateAddress;

    IGlebeEstate public glebeEstate;

    event ProposalCreated(uint256 indexed id, address indexed proposer, string description, uint256 endTime);
    event Voted(uint256 indexed id, address indexed voter, bool inSupport);
    event ProposalExecuted(uint256 indexed id, bool indexed result);
    event RevenueReceived(uint256 indexed tokenId, uint256 amount);
    event DividendsDeclared(uint256 indexed tokenId, uint256 amount);

    constructor(address _glebeEstate, address _glebeToken) {
        glebeEstate = IGlebeEstate(_glebeEstate);
    glebeEstateAddress = _glebeEstate;
        GlebeToken = _glebeToken;
        admins[msg.sender] = true;
    }

    modifier onlyAdmin(){
        require(admins[msg.sender] == true, "only admin");
        _;
    }
    receive() external payable {
        emit RevenueReceived(0, msg.value); // 0 represents ethers received for no specific token
    }

    function createProposal(string calldata _description, uint256 _duration, uint256 _shares, uint256 _sharePrice, string calldata _uri, string calldata _location) onlyAdmin external {
        uint256 proposalId = proposals.length;
        uint256 endTime = block.timestamp + _duration;
        proposals.push(Proposal({
            id: proposalId,
            proposer: msg.sender,
            description: _description,
            status: ProposalStatus.Pending,
            price: _sharePrice,
            shares: _shares,
            forVotes: 0,
            againstVotes: 0,
            creationTime: block.timestamp,
            endTime: endTime,
            tokenId: 0,
            uri: _uri,
            location: _location
        }));

        emit ProposalCreated(proposalId, msg.sender, _description, endTime);
    }

    function vote(uint256 _proposalId, bool _inSupport) external {
        require(IERC20(GlebeToken).balanceOf(msg.sender) > 0, "members only");
        require(!voters[msg.sender], "Already voted");
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.Pending, "Proposal already resolved");
        require(block.timestamp < proposal.endTime, "Voting period has ended");

        if (_inSupport) {
            proposal.forVotes++;
        } else {
            proposal.againstVotes++;
        }

        voters[msg.sender] = true;

        emit Voted(_proposalId, msg.sender, _inSupport);
    }

    function executeProposal(uint256 _proposalId) onlyAdmin external {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status == ProposalStatus.Pending, "Proposal already resolved");
        require(block.timestamp >= proposal.endTime, "Voting period has not ended");

        if (proposal.forVotes > proposal.againstVotes) {
            proposal.status = ProposalStatus.Approved;
            proposal.tokenId = glebeEstate.listAsset(proposal.proposer, proposal.shares, proposal.price, proposal.uri, proposal.description, proposal.location);
            emit ProposalExecuted(_proposalId, true);
        } else {
            proposal.status = ProposalStatus.Rejected;
            emit ProposalExecuted(_proposalId, false);
        }
    }

    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function receiveRevenue(uint256 _tokenId) external payable {
        require(_tokenId > 0, "Invalid token ID");
        assetData[_tokenId].revenue += msg.value;
        emit RevenueReceived(_tokenId, msg.value);
    }

    function declareDividends(uint256 _tokenId) external onlyAdmin {
        require(_tokenId > 0, "Invalid token ID");
        uint256 revenue = assetData[_tokenId].revenue;
        require(revenue > 0, "No revenue to declare");

        glebeEstate.distributeDividends(_tokenId, revenue);
         payable(glebeEstateAddress).transfer(revenue);

        assetData[_tokenId].dividends += revenue;
        assetData[_tokenId].revenue = 0;

        emit DividendsDeclared(_tokenId, revenue);
    }

function addAdmin(address _newAdmin) public onlyAdmin {
    admins[_newAdmin] = true;
}

function removeAdmin(address _adminToRemove) public onlyAdmin{
    require(admins[_adminToRemove], "Admin not found");
    admins[_adminToRemove] = false;
}
    
}
